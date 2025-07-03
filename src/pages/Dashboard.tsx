import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Facebook, Instagram, Plus, LogOut, Search, FileText, BarChart2 } from "lucide-react";
import { PlanStatusCard } from "@/components/PlanStatusCard";
import { FAQTable } from "@/components/FAQTable";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionContextProvider";
import { useNavigate } from "react-router-dom";

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
  const { user } = useSession();
  const navigate = useNavigate();

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

  // Đăng xuất
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col py-6 px-4">
        <div className="mb-8 flex items-center gap-2">
          <img src="/logo-2.png" alt="Logo" className="h-10 w-10 rounded" />
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
          <Button className="w-full flex items-center gap-2" variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Log out
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
                <DialogTitle className="text-center w-full">Add New Channel</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-5 my-8">
                <button
                  onClick={() => handleConnect("facebook")}
                  className="flex items-center w-80 max-w-full px-6 py-4 rounded-2xl border-2 border-blue-500 bg-white shadow hover:bg-blue-50 hover:shadow-lg transition group"
                  style={{ textAlign: "left" }}
                >
                  <span className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mr-5 group-hover:scale-105 transition">
                    <Facebook className="w-10 h-10 text-[#1877f3]" />
                  </span>
                  <span className="font-semibold text-lg text-blue-700">Facebook</span>
                </button>
                <button
                  onClick={() => handleConnect("instagram")}
                  className="flex items-center w-80 max-w-full px-6 py-4 rounded-2xl border-2 border-pink-400 bg-white shadow hover:bg-pink-50 hover:shadow-lg transition group"
                  style={{ textAlign: "left" }}
                >
                  <span className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-200 via-pink-200 to-blue-200 mr-5 group-hover:scale-105 transition">
                    {/* Instagram gradient icon */}
                    <svg width="40" height="40" viewBox="0 0 32 32">
                      <defs>
                        <radialGradient id="ig-gradient" cx="50%" cy="50%" r="80%">
                          <stop offset="0%" stopColor="#fdf497" />
                          <stop offset="45%" stopColor="#fdf497" />
                          <stop offset="60%" stopColor="#fd5949" />
                          <stop offset="90%" stopColor="#d6249f" />
                          <stop offset="100%" stopColor="#285AEB" />
                        </radialGradient>
                      </defs>
                      <rect x="0" y="0" width="32" height="32" rx="8" fill="url(#ig-gradient)" />
                      <path d="M22.5 9.5a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-7a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3h7zm-3.5 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 1.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.25-.75a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" fill="#fff"/>
                    </svg>
                  </span>
                  <span className="font-semibold text-lg text-pink-600">Instagram</span>
                </button>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="mx-auto w-32">Cancel</Button>
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