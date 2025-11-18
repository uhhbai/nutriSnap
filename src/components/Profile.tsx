import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "",
    activity_level: "",
    daily_calorie_goal: "",
  });
  const [goal, setGoal] = useState({
    target_weight: "",
    target_date: "",
    weekly_workout_days: "3",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile({
          height: profileData.height?.toString() || "",
          weight: profileData.weight?.toString() || "",
          age: profileData.age?.toString() || "",
          gender: profileData.gender || "",
          activity_level: profileData.activity_level || "",
          daily_calorie_goal: profileData.daily_calorie_goal?.toString() || "2000",
        });
      }

      const { data: goalData } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (goalData) {
        setGoal({
          target_weight: goalData.target_weight?.toString() || "",
          target_date: goalData.target_date || "",
          weekly_workout_days: goalData.weekly_workout_days?.toString() || "3",
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upsert profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          height: profile.height ? parseFloat(profile.height) : null,
          weight: profile.weight ? parseFloat(profile.weight) : null,
          age: profile.age ? parseInt(profile.age) : null,
          gender: profile.gender || null,
          activity_level: profile.activity_level || null,
          daily_calorie_goal: profile.daily_calorie_goal ? parseInt(profile.daily_calorie_goal) : 2000,
        });

      if (profileError) throw profileError;

      // Upsert goal
      const { error: goalError } = await supabase
        .from('user_goals')
        .upsert({
          user_id: user.id,
          target_weight: goal.target_weight ? parseFloat(goal.target_weight) : null,
          target_date: goal.target_date || null,
          weekly_workout_days: parseInt(goal.weekly_workout_days),
        });

      if (goalError) throw goalError;

      toast({
        title: "Profile updated!",
        description: "Your profile has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details for better AI recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                placeholder="170"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={profile.weight}
                onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                placeholder="70"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                placeholder="25"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={profile.gender} onValueChange={(v) => setProfile({ ...profile, gender: v })}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity">Activity Level</Label>
            <Select value={profile.activity_level} onValueChange={(v) => setProfile({ ...profile, activity_level: v })}>
              <SelectTrigger id="activity">
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                <SelectItem value="very_active">Very Active (physical job + exercise)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="calories">Daily Calorie Goal</Label>
            <Input
              id="calories"
              type="number"
              value={profile.daily_calorie_goal}
              onChange={(e) => setProfile({ ...profile, daily_calorie_goal: e.target.value })}
              placeholder="2000"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fitness Goals</CardTitle>
          <CardDescription>Set your targets to track progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target-weight">Target Weight (kg)</Label>
            <Input
              id="target-weight"
              type="number"
              value={goal.target_weight}
              onChange={(e) => setGoal({ ...goal, target_weight: e.target.value })}
              placeholder="65"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-date">Target Date</Label>
            <Input
              id="target-date"
              type="date"
              value={goal.target_date}
              onChange={(e) => setGoal({ ...goal, target_date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workout-days">Weekly Workout Days</Label>
            <Select value={goal.weekly_workout_days} onValueChange={(v) => setGoal({ ...goal, weekly_workout_days: v })}>
              <SelectTrigger id="workout-days">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                  <SelectItem key={days} value={days.toString()}>
                    {days} {days === 1 ? 'day' : 'days'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Profile
      </Button>
    </div>
  );
};

export default Profile;