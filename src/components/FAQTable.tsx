import { Button } from "@/components/ui/button";
import { FileText, Pencil, Upload, Trash2 } from "lucide-react";

type FAQ = {
  id: string;
  name: string;
  uploadedAt: string;
  status: "Active" | "Draft";
};

const sampleFAQs: FAQ[] = [
  {
    id: "1",
    name: "Acme FAQ.pdf",
    uploadedAt: "2024-07-01",
    status: "Active",
  },
  {
    id: "2",
    name: "Product-FAQ.docx",
    uploadedAt: "2024-06-15",
    status: "Draft",
  },
];

export function FAQTable() {
  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-600" />
          FAQ Documents
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Upload className="w-4 h-4 mr-1" />
            Upload FAQ
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2 px-2">Name</th>
              <th className="py-2 px-2">Uploaded</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sampleFAQs.map((faq) => (
              <tr key={faq.id} className="border-b last:border-0">
                <td className="py-2 px-2">{faq.name}</td>
                <td className="py-2 px-2">{faq.uploadedAt}</td>
                <td className="py-2 px-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${faq.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {faq.status}
                  </span>
                </td>
                <td className="py-2 px-2 text-right">
                  <Button size="icon" variant="ghost" className="mr-1">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}