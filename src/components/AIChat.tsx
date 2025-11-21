import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface UserProfile {
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
  activity_level?: string;
  daily_calorie_goal?: number;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
          }
          
          if (data) {
            setUserProfile(data);
            // Check if essential profile data exists
            if (!data.height || !data.weight) {
              setNeedsProfile(true);
              setMessages([{
                id: "1",
                role: "assistant",
                content: "Hi! Before I can provide personalized advice, I need you to complete your profile. Please go to the Profile tab and enter your height and weight. Once done, come back here and I'll be ready to help! 😊",
              }]);
            } else {
              setMessages([{
                id: "1",
                role: "assistant",
                content: "Hi! I'm your AI nutrition and fitness advisor. Ask me anything about diet, workouts, or healthy living!",
              }]);
            }
          } else {
            setNeedsProfile(true);
            setMessages([{
              id: "1",
              role: "assistant",
              content: "Hi! Before I can provide personalized advice, I need you to complete your profile. Please go to the Profile tab and enter your height and weight. Once done, come back here and I'll be ready to help! 😊",
            }]);
          }
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Check if profile is complete before allowing chat
    if (needsProfile || !userProfile?.height || !userProfile?.weight) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile (height & weight) in the Profile tab before chatting.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('chat-advisor', {
        body: { 
          message: input,
          userProfile 
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data || !data.response) {
        throw new Error('Invalid response from AI');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
              )}
              <Card
                className={`max-w-[80%] p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </Card>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <Card className="max-w-[80%] p-3 bg-card">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={needsProfile ? "Complete your profile first..." : "Ask me anything about nutrition or fitness..."}
            disabled={loading || needsProfile}
          />
          <Button onClick={handleSend} disabled={loading || !input.trim() || needsProfile}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;