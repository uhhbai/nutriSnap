import { useEffect, useState } from "react";
import { Flame, Droplets, Zap, Apple } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import MacroChart from "@/components/MacroChart";
import RecentMeals from "@/components/RecentMeals";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [consumed, setConsumed] = useState(0);
  const [macros, setMacros] = useState({
    protein: { current: 0, goal: 150 },
    carbs: { current: 0, goal: 250 },
    fats: { current: 0, goal: 65 },
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const { data: meals } = await supabase.from('meals').select('*').eq('user_id', user.id).gte('created_at', `${today}T00:00:00`);
      
      if (meals?.length) {
        const cal = meals.reduce((s, m) => s + m.calories, 0);
        setConsumed(cal);
        setMacros({
          protein: { current: Math.round(meals.reduce((s, m) => s + (m.protein || 0), 0)), goal: 150 },
          carbs: { current: Math.round(meals.reduce((s, m) => s + (m.carbs || 0), 0)), goal: 250 },
          fats: { current: Math.round(meals.reduce((s, m) => s + (m.fat || 0), 0)), goal: 65 },
        });
      }
    };
    fetchData();
  }, []);

  const remaining = dailyGoal - consumed;
  const progressPercentage = (consumed / dailyGoal) * 100;

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Today's Progress</h1>
        <p className="text-muted-foreground">Track your nutrition goals</p>
      </div>

      {/* Calorie Summary Card */}
      <Card className="p-6 bg-gradient-to-br from-card to-secondary border-0 shadow-md">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Calories</p>
                <p className="text-2xl font-bold text-foreground">{consumed}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-2xl font-bold text-accent">{remaining}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-xs text-muted-foreground text-center">
              Goal: {dailyGoal} kcal
            </p>
          </div>
        </div>
      </Card>

      {/* Macros Grid */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center space-y-2 border-0 shadow-sm">
          <div className="w-10 h-10 mx-auto rounded-full bg-info/10 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-info" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Protein</p>
            <p className="text-lg font-bold text-foreground">{macros.protein.current}g</p>
            <p className="text-xs text-muted-foreground">of {macros.protein.goal}g</p>
          </div>
        </Card>

        <Card className="p-4 text-center space-y-2 border-0 shadow-sm">
          <div className="w-10 h-10 mx-auto rounded-full bg-warning/10 flex items-center justify-center">
            <Apple className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Carbs</p>
            <p className="text-lg font-bold text-foreground">{macros.carbs.current}g</p>
            <p className="text-xs text-muted-foreground">of {macros.carbs.goal}g</p>
          </div>
        </Card>

        <Card className="p-4 text-center space-y-2 border-0 shadow-sm">
          <div className="w-10 h-10 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Fats</p>
            <p className="text-lg font-bold text-foreground">{macros.fats.current}g</p>
            <p className="text-xs text-muted-foreground">of {macros.fats.goal}g</p>
          </div>
        </Card>
      </div>

      {/* Macro Chart */}
      <MacroChart macros={macros} />

      {/* Recent Meals */}
      <RecentMeals />
    </div>
  );
};

export default Dashboard;
