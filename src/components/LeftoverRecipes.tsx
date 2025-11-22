import { useState, useRef } from "react";
import { Camera, Upload, Sparkles, Clock, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Recipe {
  name: string;
  description: string;
  time: number;
  servings: number;
  difficulty: string;
  calories: number;
  sustainability: number;
  ingredients: string[];
  instructions: string[];
}

const LeftoverRecipes = () => {
  const [leftoverImage, setLeftoverImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRecipes, setShowRecipes] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setLeftoverImage(imageData);
        handleAnalyzeLeftovers(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeLeftovers = async (imageData: string) => {
    if (!imageData) return;

    setIsAnalyzing(true);
    toast.info("Analyzing your leftovers...");
    
    try {
      const { data, error } = await supabase.functions.invoke("generate-recipes", {
        body: { imageBase64: imageData },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setRecipes(data.recipes || []);
      setIngredients(data.ingredients || []);
      setIsAnalyzing(false);
      setShowRecipes(true);
      toast.success("Found sustainable recipes for you!");
    } catch (error: any) {
      console.error('Recipe generation error:', error);
      setIsAnalyzing(false);
      toast.error(error.message || "Failed to generate recipes. Please try again.");
    }
  };

  const handleTryAgain = () => {
    setLeftoverImage(null);
    setShowRecipes(false);
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Leftover Recipes</h1>
        <p className="text-muted-foreground">
          Reduce waste with sustainable recipe suggestions
        </p>
      </div>

      {/* Upload Section */}
      {!showRecipes && (
        <Card className="p-8 border-2 border-dashed border-border bg-gradient-to-br from-card to-secondary text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
            <Camera className="w-10 h-10 text-accent" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Snap Your Leftovers
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Take a photo of your leftover food and we'll suggest creative, sustainable recipes
            </p>
          </div>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-lg"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload Leftovers Photo
              </>
            )}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </Card>
      )}

      {/* Recipe Results */}
      {showRecipes && leftoverImage && (
        <div className="space-y-6">
          {/* Leftover Image */}
          <Card className="overflow-hidden border-0 shadow-md">
            <img
              src={leftoverImage}
              alt="Your leftovers"
              className="w-full h-40 object-cover"
            />
          </Card>

          {/* Sustainability Impact */}
          <Card className="p-6 bg-gradient-to-br from-success/10 to-primary/10 border-success/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Eco Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Using leftovers reduces food waste by ~30%
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-bold text-success">2.5kg</p>
                <p className="text-xs text-muted-foreground">CO₂ saved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">$12</p>
                <p className="text-xs text-muted-foreground">Money saved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">3</p>
                <p className="text-xs text-muted-foreground">Meals created</p>
              </div>
            </div>
          </Card>

          {/* Recipe Suggestions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Recipe Suggestions
            </h3>
            
            {recipes.map((recipe, index) => (
              <Card
                key={index}
                className="p-5 border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex gap-4">
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {recipe.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {recipe.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {recipe.time}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        {recipe.servings} servings
                      </Badge>
                      <Badge className="bg-success/10 text-success border-success/20 text-xs">
                        {recipe.sustainability}% sustainable
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">
                        {recipe.calories} kcal/serving
                      </span>
                      <Button size="sm" className="bg-primary text-primary-foreground">
                        View Recipe
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Try Again Button */}
          <Button
            onClick={handleTryAgain}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Camera className="w-5 h-5 mr-2" />
            Analyze Different Leftovers
          </Button>
        </div>
      )}

      {/* Info Section */}
      {!showRecipes && (
        <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-primary/5 to-accent/5">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Why Use Leftover Recipes?
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <span>Reduce food waste and environmental impact</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <span>Save money on groceries</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <span>Discover creative ways to use what you have</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <span>Promote sustainable eating habits</span>
            </li>
          </ul>
        </Card>
      )}
    </div>
  );
};

export default LeftoverRecipes;
