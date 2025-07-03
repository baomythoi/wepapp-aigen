import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <img src="/logo-2.png" alt="Logo" className="h-20 w-20 mb-6 rounded" />
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">AI Chatbot Customer Dashboard</h1>
        <p className="text-xl text-gray-600 mb-6">
          Manage your chat channels, FAQ, and analytics for your AI chatbot.
        </p>
        <a href="/dashboard">
          <Button size="lg" className="px-8 py-4 text-lg">Go to Dashboard</Button>
        </a>
      </div>
    </div>
  );
};

export default Index;