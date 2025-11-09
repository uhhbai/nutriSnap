import { ArrowLeft, Save, Share2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface FoodAnalysisResultProps {
  image: string;
  onClose: () => void;
  onRetake: () => void;
}

const FoodAnalysisResult = ({ image, onClose, onRetake }: FoodAnalysisResultProps) => {
  // Mock analysis data - replace with real AI analysis
  const analysis = {
    name: "Grilled Chicken Salad",
    calories: 385,
    servingSize: "1 bowl (350g)",
    macros: {
      protein: { amount: 42, percentage: 88 },
      carbs: { amount: 28, percentage: 46 },
      fats: { amount: 12, percentage: 42 },
    },
    nutrients: [
      { name: "Fiber", amount: "8g", daily: 32 },
      { name: "Sugar", amount: "6g", daily: 12 },
      { name: "Sodium", amount: "420mg", daily: 18 },
      { name: "Vitamin C", amount: "45mg", daily: 75 },
      { name: "Iron", amount: "3.2mg", daily: 18 },
      { name: "Calcium", amount: "120mg", daily: 12 },
    ],
    ingredients: [
      "Grilled chicken breast",
      "Mixed greens",
      "Cherry tomatoes",
      "Cucumber",
      "Olive oil dressing",
    ],
    healthScore: 92,
  };

  const handleSave = () => {
    toast.success("Meal saved to your diary!");
    setTimeout(() => onClose(), 500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onRetake}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-bold text-foreground">Analysis Results</h2>
          <Button variant="ghost" size="icon">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Food Image */}
        <Card className="overflow-hidden border-0 shadow-md">
          <img src={image} alt="Analyzed food" className="w-full h-48 object-cover" />
        </Card>

        {/* Food Name & Health Score */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{analysis.name}</h1>
            <p className="text-sm text-muted-foreground">{analysis.servingSize}</p>
          </div>
          <Badge 
            className="bg-success/10 text-success border-success/20 text-lg px-3 py-1"
          >
            {analysis.healthScore}/100
          </Badge>
        </div>

        {/* Calories Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-success/5 border-primary/20">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Calories</p>
            <p className="text-5xl font-bold text-primary">{analysis.calories}</p>
            <p className="text-xs text-muted-foreground mt-1">kcal</p>
          </div>
        </Card>

        {/* Macros */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Macronutrients</h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Protein</span>
                <span className="text-sm text-muted-foreground">{analysis.macros.protein.amount}g</span>
              </div>
              <Progress value={analysis.macros.protein.percentage} className="h-2 bg-info/20" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Carbs</span>
                <span className="text-sm text-muted-foreground">{analysis.macros.carbs.amount}g</span>
              </div>
              <Progress value={analysis.macros.carbs.percentage} className="h-2 bg-warning/20" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Fats</span>
                <span className="text-sm text-muted-foreground">{analysis.macros.fats.amount}g</span>
              </div>
              <Progress value={analysis.macros.fats.percentage} className="h-2 bg-accent/20" />
            </div>
          </div>
        </div>

        {/* Nutrients Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Key Nutrients</h3>
          <div className="grid grid-cols-2 gap-3">
            {analysis.nutrients.map((nutrient) => (
              <Card key={nutrient.name} className="p-4 border-0 shadow-sm">
                <p className="text-xs text-muted-foreground">{nutrient.name}</p>
                <p className="text-lg font-bold text-foreground">{nutrient.amount}</p>
                <p className="text-xs text-muted-foreground">{nutrient.daily}% daily</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Detected Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.ingredients.map((ingredient) => (
              <Badge key={ingredient} variant="secondary" className="px-3 py-1">
                {ingredient}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-primary to-success text-primary-foreground shadow-lg shadow-primary/30"
            size="lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Save to Diary
          </Button>
          
          <Button
            onClick={onRetake}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Analyze Another Meal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodAnalysisResult;
