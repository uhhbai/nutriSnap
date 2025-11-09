import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const MealHistory = () => {
  const [selectedDate, setSelectedDate] = useState("Today");

  // Mock data - replace with real data
  const history = [
    {
      date: "Today",
      totalCalories: 1340,
      goal: 2000,
      meals: [
        { name: "Breakfast Bowl", calories: 420, time: "8:30 AM", image: "🥣" },
        { name: "Grilled Chicken Salad", calories: 385, time: "12:45 PM", image: "🥗" },
        { name: "Protein Smoothie", calories: 235, time: "3:30 PM", image: "🥤" },
        { name: "Greek Yogurt", calories: 180, time: "5:00 PM", image: "🥄" },
        { name: "Veggie Stir Fry", calories: 120, time: "6:30 PM", image: "🥘" },
      ],
    },
    {
      date: "Yesterday",
      totalCalories: 2150,
      goal: 2000,
      meals: [
        { name: "Oatmeal with Berries", calories: 380, time: "7:45 AM", image: "🥣" },
        { name: "Turkey Sandwich", calories: 520, time: "1:00 PM", image: "🥪" },
        { name: "Apple & Almonds", calories: 200, time: "4:00 PM", image: "🍎" },
        { name: "Salmon with Rice", calories: 650, time: "7:30 PM", image: "🍱" },
        { name: "Dark Chocolate", calories: 400, time: "9:00 PM", image: "🍫" },
      ],
    },
  ];

  const todayData = history[0];
  const yesterdayData = history[1];
  const calorieChange = todayData.totalCalories - yesterdayData.totalCalories;
  const isPositive = calorieChange > 0;

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Meal History</h1>
        <p className="text-muted-foreground">Track your nutrition over time</p>
      </div>

      {/* Summary Card */}
      <Card className="p-6 bg-gradient-to-br from-card to-secondary border-0 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Today's Summary</h3>
          </div>
          <Badge variant="secondary">{todayData.meals.length} meals</Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Calories</p>
            <p className="text-3xl font-bold text-primary">{todayData.totalCalories}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">vs Yesterday</p>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-5 h-5 text-accent" />
              ) : (
                <TrendingDown className="w-5 h-5 text-success" />
              )}
              <p className="text-3xl font-bold text-foreground">
                {Math.abs(calorieChange)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Date Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {history.map((day) => (
          <button
            key={day.date}
            onClick={() => setSelectedDate(day.date)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedDate === day.date
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground"
            }`}
          >
            {day.date}
          </button>
        ))}
      </div>

      {/* Meals List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          {selectedDate}'s Meals
        </h3>
        
        {history
          .find((d) => d.date === selectedDate)
          ?.meals.map((meal, index) => (
            <Card
              key={index}
              className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{meal.image}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{meal.name}</h4>
                  <p className="text-sm text-muted-foreground">{meal.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">{meal.calories}</p>
                  <p className="text-xs text-muted-foreground">kcal</p>
                </div>
              </div>
            </Card>
          ))}
      </div>

      {/* Weekly Insights */}
      <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-primary/5 to-success/5">
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Weekly Insights
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Average daily calories</span>
            <span className="font-semibold text-foreground">1,745 kcal</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Most frequent meal</span>
            <span className="font-semibold text-foreground">Lunch (7 times)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Goal achievement</span>
            <span className="font-semibold text-success">87%</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MealHistory;
