import { useState, useRef, useEffect } from "react";
import { Camera, X, Sparkles, Upload, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import FoodAnalysisResult from "@/components/FoodAnalysisResult";

interface CameraCaptureProps {
  onClose: () => void;
}

const CameraCapture = ({ onClose }: CameraCaptureProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(imageData);
    stopCamera();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    toast.info("Analyzing your food...");

    try {
      const { data, error } = await supabase.functions.invoke("analyze-food", {
        body: { image: capturedImage },
      });

      if (error) {
        console.error("Analysis error:", error);
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      console.log("Analysis result:", data);
      setAnalysisData(data.analysis);
      
      // Save meal to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: insertError } = await supabase
          .from('meals')
          .insert({
            user_id: user.id,
            name: data.analysis.name,
            calories: data.analysis.calories,
            protein: data.analysis.macros.protein,
            carbs: data.analysis.macros.carbs,
            fat: data.analysis.macros.fat,
            fiber: data.analysis.nutrients.fiber,
            serving_size: data.analysis.servingSize,
            image_url: capturedImage,
          });

        if (insertError) {
          console.error('Error saving meal:', insertError);
        } else {
          console.log('Meal saved to database');
        }
      }

      setShowResults(true);
      toast.success("Analysis complete!");
    } catch (error: any) {
      console.error("Failed to analyze food:", error);
      toast.error(error.message || "Failed to analyze food. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setShowResults(false);
    setAnalysisData(null);
    startCamera();
  };

  if (showResults && capturedImage && analysisData) {
    return (
      <FoodAnalysisResult
        image={capturedImage}
        analysis={analysisData}
        onClose={onClose}
        onRetake={handleRetake}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <h2 className="text-xl font-bold text-foreground">Capture Food</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Camera/Preview Area */}
      <div className="flex-1 flex items-center justify-center p-4 bg-black">
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
          <div className="relative w-full max-w-md">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera Controls Overlay */}
            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="secondary"
                size="icon"
                className="w-12 h-12 rounded-full"
              >
                <Upload className="w-5 h-5" />
              </Button>

              <Button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-success shadow-lg shadow-primary/50"
              >
                <Camera className="w-8 h-8" />
              </Button>

              <Button
                onClick={switchCamera}
                variant="secondary"
                size="icon"
                className="w-12 h-12 rounded-full"
              >
                <RotateCw className="w-5 h-5" />
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}
      </div>

      {!capturedImage && (
        <div className="p-4 bg-card border-t border-border">
          <p className="text-sm text-center text-muted-foreground">
            Position food in frame • Tap to capture • Use good lighting
          </p>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
