import { useState } from "react";
import { Camera, Home, History, TrendingUp, ChefHat } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import CameraCapture from "@/components/CameraCapture";
import MealHistory from "@/components/MealHistory";
import LeftoverRecipes from "@/components/LeftoverRecipes";

type TabType = "home" | "camera" | "history" | "recipes";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Dashboard />;
      case "camera":
        return <CameraCapture onClose={() => setActiveTab("home")} />;
      case "history":
        return <MealHistory />;
      case "recipes":
        return <LeftoverRecipes />;
      default:
        return <Dashboard />;
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
        <div className="flex items-center justify-around px-4 py-3">
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
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "home" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs font-medium">Stats</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Index;
