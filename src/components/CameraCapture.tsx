import { useState, useRef } from "react";
import { Camera, X, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import FoodAnalysisResult from "@/components/FoodAnalysisResult";

interface CameraCaptureProps {
  onClose: () => void;
}

const CameraCapture = ({ onClose }: CameraCaptureProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    toast.info("Analyzing your food...");
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      toast.success("Analysis complete!");
    }, 2000);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setShowResults(false);
  };

  if (showResults && capturedImage) {
    return <FoodAnalysisResult image={capturedImage} onClose={onClose} onRetake={handleRetake} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Capture Food</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Camera/Preview Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        {capturedImage ? (
          <div className="w-full max-w-md space-y-4">
            <Card className="overflow-hidden border-0 shadow-lg">
              <img
                src={capturedImage}
                alt="Captured food"
                className="w-full h-auto"
              />
            </Card>
            
            <div className="space-y-3">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-primary to-success text-primary-foreground shadow-lg shadow-primary/30"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze Food
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleRetake}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Retake Photo
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md space-y-4">
            <Card className="p-12 border-2 border-dashed border-border bg-secondary/50 text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Take a Photo
                </h3>
                <p className="text-sm text-muted-foreground">
                  Snap a picture of your meal to get instant nutrition analysis
                </p>
              </div>
            </Card>

            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-primary to-success text-primary-foreground shadow-lg shadow-primary/30"
              size="lg"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Photo
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            <p className="text-xs text-center text-muted-foreground">
              Take a clear photo with good lighting for best results
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
