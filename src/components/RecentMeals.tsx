import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RecentMeals = () => {
  // Mock data - replace with real data
  const meals = [
    {
      id: 1,
      name: "Breakfast Bowl",
      time: "8:30 AM",
      calories: 420,
      type: "breakfast",
    },
    {
      id: 2,
      name: "Grilled Chicken Salad",
      time: "12:45 PM",
      calories: 385,
      type: "lunch",
    },
    {
      id: 3,
      name: "Protein Smoothie",
      time: "3:30 PM",
      calories: 235,
      type: "snack",
    },
  ];

  const mealTypeColors = {
    breakfast: "bg-warning/10 text-warning border-warning/20",
    lunch: "bg-info/10 text-info border-info/20",
    dinner: "bg-accent/10 text-accent border-accent/20",
    snack: "bg-primary/10 text-primary border-primary/20",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Recent Meals</h3>
        <button className="text-sm text-primary font-medium">View All</button>
      </div>

      <div className="space-y-3">
        {meals.map((meal) => (
          <Card
            key={meal.id}
            className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">{meal.name}</h4>
                  <Badge
                    className={`text-xs ${
                      mealTypeColors[meal.type as keyof typeof mealTypeColors]
                    }`}
                  >
                    {meal.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{meal.time}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">{meal.calories}</p>
                <p className="text-xs text-muted-foreground">kcal</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentMeals;
