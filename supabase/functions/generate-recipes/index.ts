import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Analyzing leftover food image...');

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
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this leftover food image and suggest 3-5 creative, sustainable recipes that use these ingredients. 
                
For each recipe, provide:
- name: Creative recipe name
- description: Brief description (1-2 sentences)
- time: Cooking time in minutes
- servings: Number of servings
- difficulty: easy, medium, or hard
- calories: Estimated calories per serving
- sustainability: Percentage (how sustainable this recipe is)
- ingredients: List of ingredients
- instructions: Step-by-step cooking instructions

Return ONLY valid JSON in this exact format:
{
  "ingredients": ["ingredient1", "ingredient2"],
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Brief description",
      "time": 30,
      "servings": 4,
      "difficulty": "medium",
      "calories": 350,
      "sustainability": 85,
      "ingredients": ["ingredient1", "ingredient2"],
      "instructions": ["Step 1", "Step 2", "Step 3"]
    }
  ]
}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices[0].message.content;

    // Clean up the response to extract JSON
    aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const result = JSON.parse(aiResponse);
    
    console.log('Recipes generated successfully');

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-recipes:', error);
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