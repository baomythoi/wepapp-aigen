import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Pencil, Upload, Trash2, Download, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionContextProvider";

type FAQ = {
  id: string;
  category: string;
  question: string;
  answer: string;
  status: "Active" | "Draft";
};

export function FAQTable() {
  const { user } = useSession();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch FAQ từ Supabase
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("faqs")
      .select("id,category,question,answer,status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setFaqs(data as FAQ[]);
        setLoading(false);
      });
  }, [user]);

  // Tải file mẫu
  const handleDownloadTemplate = () => {
    window.open("/faq-template.xlsx", "_blank");
  };

  // Upload file Excel và thêm hàng loạt vào Supabase
  const handleUploadTemplate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
      const [header, ...body] = rows;
      const colIdx = {
        category: header.findIndex((h) => h.toLowerCase() === "category"),
        question: header.findIndex((h) => h.toLowerCase() === "question"),
        answer: header.findIndex((h) => h.toLowerCase() === "answer"),
      };
      const newFaqs = body
        .filter((row) => row[colIdx.question] && row[colIdx.answer])
        .map((row) => ({
          user_id: user.id,
          category: row[colIdx.category] || "",
          question: row[colIdx.question] || "",
          answer: row[colIdx.answer] || "",
          status: "Active",
        }));
      if (newFaqs.length > 0) {
        setLoading(true);
        const { error } = await supabase.from("faqs").insert(newFaqs);
        if (!error) {
          // Refetch
          const { data } = await supabase
            .from("faqs")
            .select("id,category,question,answer,status")
            .eq("user_id", user.id)
            .order("created_at", { ascending: true });
          setFaqs(data as FAQ[]);
        }
        setLoading(false);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsBinaryString(file);
  };

  // Chỉnh sửa FAQ
  const handleEdit = async (id: string) => {
    const faq = faqs.find((f) => f.id === id);
    if (!faq || !user) return;
    const newQuestion = prompt("Cập nhật câu hỏi:", faq.question);
    const newAnswer = prompt("Cập nhật câu trả lời:", faq.answer);
    if (newQuestion !== null && newAnswer !== null) {
      setLoading(true);
      await supabase
        .from("faqs")
        .update({ question: newQuestion, answer: newAnswer })
        .eq("id", id)
        .eq("user_id", user.id);
      // Refetch
      const { data } = await supabase
        .from("faqs")
        .select("id,category,question,answer,status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      setFaqs(data as FAQ[]);
      setLoading(false);
    }
  };

  // Xóa FAQ
  const handleDelete = async (id: string) => {
    if (!user) return;
    if (window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
      setLoading(true);
      await supabase.from("faqs").delete().eq("id", id).eq("user_id", user.id);
      // Refetch
      const { data } = await supabase
        .from("faqs")
        .select("id,category,question,answer,status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      setFaqs(data as FAQ[]);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-600" />
          FAQ Documents
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleDownloadTemplate}>
            <Download className="w-4 h-4 mr-1" />
            Tải mẫu
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-1" />
            Thêm mẫu
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleUploadTemplate}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2 px-2">Category</th>
              <th className="py-2 px-2">Question</th>
              <th className="py-2 px-2">Answer</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq.id} className="border-b last:border-0">
                <td className="py-2 px-2">{faq.category}</td>
                <td className="py-2 px-2">{faq.question}</td>
                <td className="py-2 px-2">{faq.answer}</td>
                <td className="py-2 px-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      faq.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {faq.status}
                  </span>
                </td>
                <td className="py-2 px-2 text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="mr-1"
                    onClick={() => handleEdit(faq.id)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(faq.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="flex items-center justify-center py-8 text-gray-400">
            <Loader2 className="animate-spin mr-2" /> Đang tải dữ liệu...
          </div>
        )}
        {!loading && faqs.length === 0 && (
          <div className="text-center text-gray-400 py-8">Chưa có dữ liệu FAQ.</div>
        )}
      </div>
    </div>
  );
}