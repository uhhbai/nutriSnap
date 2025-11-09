import { Card } from "@/components/ui/card";

interface MacroChartProps {
  macros: {
    protein: { current: number; goal: number };
    carbs: { current: number; goal: number };
    fats: { current: number; goal: number };
  };
}

const MacroChart = ({ macros }: MacroChartProps) => {
  const proteinPercentage = (macros.protein.current / macros.protein.goal) * 100;
  const carbsPercentage = (macros.carbs.current / macros.carbs.goal) * 100;
  const fatsPercentage = (macros.fats.current / macros.fats.goal) * 100;

  return (
    <Card className="p-6 border-0 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">Daily Goals</h3>
      
      <div className="space-y-6">
        {/* Protein */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Protein</span>
            <span className="text-muted-foreground">
              {macros.protein.current}g / {macros.protein.goal}g
            </span>
          </div>
          <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-info to-info/80 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(proteinPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Carbs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Carbs</span>
            <span className="text-muted-foreground">
              {macros.carbs.current}g / {macros.carbs.goal}g
            </span>
          </div>
          <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-warning to-warning/80 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(carbsPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Fats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Fats</span>
            <span className="text-muted-foreground">
              {macros.fats.current}g / {macros.fats.goal}g
            </span>
          </div>
          <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(fatsPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MacroChart;
