import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Pencil, Upload, Trash2, Download } from "lucide-react";
import * as XLSX from "xlsx";

type FAQ = {
  id: string;
  category: string;
  question: string;
  answer: string;
  status: "Active" | "Draft";
};

const initialFAQs: FAQ[] = [
  {
    id: "1",
    category: "General",
    question: "Làm sao để sử dụng chatbot?",
    answer: "Bạn chỉ cần nhắn tin vào fanpage.",
    status: "Active",
  },
  {
    id: "2",
    category: "Product",
    question: "Chatbot hỗ trợ những gì?",
    answer: "Chatbot hỗ trợ trả lời tự động các câu hỏi thường gặp.",
    status: "Draft",
  },
];

export function FAQTable() {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tải file mẫu
  const handleDownloadTemplate = () => {
    window.open("/faq-template.xlsx", "_blank");
  };

  // Xử lý upload file Excel
  const handleUploadTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
      // rows[0] là header
      const [header, ...body] = rows;
      const colIdx = {
        category: header.findIndex((h) => h.toLowerCase() === "category"),
        question: header.findIndex((h) => h.toLowerCase() === "question"),
        answer: header.findIndex((h) => h.toLowerCase() === "answer"),
      };
      const newFaqs: FAQ[] = body
        .filter((row) => row[colIdx.question] && row[colIdx.answer])
        .map((row, idx) => ({
          id: `imported-${Date.now()}-${idx}`,
          category: row[colIdx.category] || "",
          question: row[colIdx.question] || "",
          answer: row[colIdx.answer] || "",
          status: "Active",
        }));
      setFaqs((prev) => [...prev, ...newFaqs]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsBinaryString(file);
  };

  // Chỉnh sửa FAQ
  const handleEdit = (id: string) => {
    const faq = faqs.find((f) => f.id === id);
    if (!faq) return;
    const newQuestion = prompt("Cập nhật câu hỏi:", faq.question);
    const newAnswer = prompt("Cập nhật câu trả lời:", faq.answer);
    if (newQuestion !== null && newAnswer !== null) {
      setFaqs((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, question: newQuestion, answer: newAnswer }
            : f
        )
      );
    }
  };

  // Xóa FAQ
  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
      setFaqs((prev) => prev.filter((f) => f.id !== id));
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
        {faqs.length === 0 && (
          <div className="text-center text-gray-400 py-8">Chưa có dữ liệu FAQ.</div>
        )}
      </div>
    </div>
  );
}