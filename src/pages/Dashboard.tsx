import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Facebook, Instagram, Plus, LogIn, Search, FileText, BarChart2 } from "lucide-react";
import { PlanStatusCard } from "@/components/PlanStatusCard";
import { FAQTable } from "@/components/FAQTable";

type Channel = {
  id: string;
  type: "facebook" | "instagram";
  name: string;
  token: string;
};

const initialChannels: Channel[] = [
  {
    id: "1",
    type: "facebook",
    name: "Acme FB Page",
    token: "••••••••••••••••••••••••••••••",
  },
  {
    id: "2",
    type: "instagram",
    name: "Acme IG",
    token: "••••••••••••••••••••••••••••••",
  },
];

// Thay thế URL webhook thật của bạn tại đây
const FACEBOOK_WEBHOOK_URL = "https://your-backend.com/webhook/facebook";
const INSTAGRAM_WEBHOOK_URL = "https://your-backend.com/webhook/instagram";

export default function Dashboard() {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [search, setSearch] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Plan/quota state (mocked for now)
  const plan = "Free";
  const quota = 100;
  const used = 0;

  // Filtered channels
  const filteredChannels = channels.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase())
  );

  // Remove channel handler
  const handleRemoveChannel = (id: string) => {
    setChannels(channels.filter((c) => c.id !== id));
  };

  // Redirect to webhook
  const handleConnect = (type: "facebook" | "instagram") => {
    if (type === "facebook") {
      window.location.href = FACEBOOK_WEBHOOK_URL;
    } else {
      window.location.href = INSTAGRAM_WEBHOOK_URL;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col py-6 px-4">
        <div className="mb-8 flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
          <span className="font-bold text-lg">AI Chatbot Dashboard</span>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <a href="#channels" className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 font-medium text-gray-900">
                <Facebook className="w-5 h-5 text-blue-600" />
                Channels
              </a>
            </li>
            <li>
              <a href="#analytics" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 font-medium text-gray-700">
                <BarChart2 className="w-5 h-5 text-purple-600" />
                Analytics
              </a>
            </li>
            <li>
              <a href="#faq" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 font-medium text-gray-700">
                <FileText className="w-5 h-5 text-green-600" />
                FAQ
              </a>
            </li>
          </ul>
        </nav>
        <div className="mt-8">
          <Button className="w-full flex items-center gap-2" variant="outline">
            <LogIn className="w-4 h-4" />
            Facebook Login
          </Button>
        </div>
        <div className="mt-6">
          <Badge variant="secondary" className="w-full justify-center py-2">
            Free Plan
          </Badge>
          <div className="text-xs text-gray-500 mt-2 text-center">
            100 conversations left
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50">
        {/* Plan/Quota Card */}
        <PlanStatusCard plan={plan} quota={quota} used={used} />

        {/* Header */}
        <div className="flex items-center justify-between mb-8" id="channels">
          <h1 className="text-2xl font-bold">Channels</h1>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="default" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Channel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Channel</DialogTitle>
              </DialogHeader>
              <div className="flex gap-4 mb-6 mt-2">
                <Button
                  variant="outline"
                  className="flex-1 flex flex-col items-center py-4 border-2 border-blue-600 bg-blue-50 hover:bg-blue-100 transition"
                  onClick={() => handleConnect("facebook")}
                >
                  <Facebook className="w-7 h-7 text-blue-600 mb-1" />
                  <span className="font-medium text-sm text-blue-700">Facebook Messenger</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 flex flex-col items-center py-4 border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 transition"
                  onClick={() => handleConnect("instagram")}
                >
                  <Instagram className="w-7 h-7 text-gray-500 mb-1" />
                  <span className="font-medium text-sm text-gray-600">Instagram</span>
                </Button>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-72">
            <Input
              placeholder="Search channels..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Channel List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChannels.map((channel) => (
            <div key={channel.id} className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 border">
              <div className="flex items-center gap-2 mb-2">
                {channel.type === "facebook" ? (
                  <Facebook className="w-5 h-5 text-blue-600" />
                ) : (
                  <Instagram className="w-5 h-5 text-pink-500" />
                )}
                <span className="font-semibold">{channel.name}</span>
                <Badge variant="outline" className="ml-auto capitalize">{channel.type}</Badge>
              </div>
              <div className="text-xs text-gray-500 mb-2">
                API Token: <span className="font-mono">{channel.token}</span>
              </div>
              <div className="flex gap-2 mt-auto">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleRemoveChannel(channel.id)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Section */}
        <div id="analytics" className="mt-16">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-purple-600" />
            Analytics <span className="ml-2 text-xs text-gray-400">(Coming soon)</span>
          </h2>
          <div className="bg-white border rounded-lg p-8 text-gray-400 text-center">
            Analytics dashboard will appear here.
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="mt-16">
          <FAQTable />
        </div>
      </main>
    </div>
  );
}