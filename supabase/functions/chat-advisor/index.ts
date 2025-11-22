import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userProfile } = await req.json();
    
    console.log('Received request with message:', message);
    console.log('User profile:', userProfile);
    
    // Get the authorization header (JWT token)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header found');
      throw new Error('Unauthorized - Missing authentication');
    }

    console.log('Authorization header present');

    // Create Supabase client with service role to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Extract JWT token and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Error verifying user:', userError);
      throw new Error('Unauthorized - Invalid token');
    }

    console.log('User authenticated:', user.id);

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY not configured');
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build context from user profile
    let context = 'You are a helpful nutrition and fitness advisor. ';
    if (userProfile) {
      context += `User profile: `;
      if (userProfile.height) context += `Height: ${userProfile.height}cm, `;
      if (userProfile.weight) context += `Weight: ${userProfile.weight}kg, `;
      if (userProfile.age) context += `Age: ${userProfile.age}, `;
      if (userProfile.gender) context += `Gender: ${userProfile.gender}, `;
      if (userProfile.activity_level) context += `Activity level: ${userProfile.activity_level}, `;
      if (userProfile.daily_calorie_goal) context += `Daily calorie goal: ${userProfile.daily_calorie_goal} kcal, `;
      if (userProfile.weekly_workout_days) context += `Weekly workout days: ${userProfile.weekly_workout_days} days/week`;
    }

    console.log('Sending request to Lovable AI with context:', context);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: context + ' Provide personalized diet and workout advice. Keep responses concise and actionable.'
          },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`AI service error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid AI response structure:', data);
      throw new Error('Invalid response from AI service');
    }
    
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat-advisor:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});