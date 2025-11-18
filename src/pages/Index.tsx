import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Home, History, ChefHat, MessageCircle, User } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import CameraCapture from "@/components/CameraCapture";
import MealHistory from "@/components/MealHistory";
import LeftoverRecipes from "@/components/LeftoverRecipes";
import AIChat from "@/components/AIChat";
import Profile from "@/components/Profile";
import { supabase } from "@/integrations/supabase/client";

type TabType = "home" | "camera" | "history" | "recipes" | "chat" | "profile";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
    });
  }, [navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <Dashboard />;
      case "camera": return <CameraCapture onClose={() => setActiveTab("home")} />;
      case "history": return <MealHistory />;
      case "recipes": return <LeftoverRecipes />;
      case "chat": return <AIChat />;
      case "profile": return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col max-w-md mx-auto">
      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border shadow-lg">
        <div className="grid grid-cols-6 items-center px-2 py-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "home" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "history" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <History className="w-6 h-6" />
            <span className="text-xs font-medium">History</span>
          </button>

          {/* Camera Button - Featured */}
          <button
            onClick={() => setActiveTab("camera")}
            className="relative -mt-6"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-success flex items-center justify-center shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow">
              <Camera className="w-8 h-8 text-primary-foreground" />
            </div>
          </button>

          <button
            onClick={() => setActiveTab("recipes")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "recipes" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <ChefHat className="w-6 h-6" />
            <span className="text-xs font-medium">Recipes</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
              activeTab === "chat" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] font-medium">AI Chat</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
              activeTab === "profile" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Index;
