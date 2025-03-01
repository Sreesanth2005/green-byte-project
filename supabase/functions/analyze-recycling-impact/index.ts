
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch user's recycling data
    const { data: pickups, error: pickupsError } = await supabase
      .from("schedule_pickups")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "completed");

    if (pickupsError) {
      throw new Error(`Error fetching user pickups: ${pickupsError.message}`);
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY") || "");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a detailed prompt with the user's recycling data
    const totalItems = pickups?.length || 0;
    const totalCredits = pickups?.reduce((sum, pickup) => sum + (pickup.eco_credits_earned || 0), 0) || 0;
    const categories = pickups?.reduce((acc, pickup) => {
      acc[pickup.category] = (acc[pickup.category] || 0) + 1;
      return acc;
    }, {}) || {};

    const prompt = `
      Analyze the following e-waste recycling data for a user and provide insights:
      
      Total items recycled: ${totalItems}
      Total eco-credits earned: ${totalCredits}
      Categories of items recycled: ${JSON.stringify(categories)}
      
      Please generate a JSON response with the following structure:
      {
        "summary": "A concise 2-3 sentence summary of their recycling impact",
        "environmentalImpact": {
          "co2Reduced": "Estimated CO2 reduction in kg",
          "waterSaved": "Estimated water saved in liters",
          "energySaved": "Estimated energy saved in kWh"
        },
        "recommendations": ["3-5 personalized recommendations based on their recycling patterns"],
        "achievementUnlocked": "A motivational achievement they've reached",
        "nextMilestone": "Their next recycling milestone to aim for"
      }
      
      Base your estimates on realistic environmental impact figures for e-waste recycling.
      Make the recommendations specific to their recycling patterns.
      Make the tone positive and encouraging.
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Try to parse the response as JSON
    let analysis;
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                         text.match(/```\s*([\s\S]*?)\s*```/) ||
                         text.match(/{[\s\S]*?}/);
      
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
      } else {
        // If no JSON format is detected, use the whole text
        analysis = JSON.parse(text);
      }
    } catch (e) {
      console.error("Error parsing Gemini response as JSON:", e);
      // Fallback: create a simple structure
      analysis = {
        summary: "You've made a positive impact by recycling electronic waste. Keep up the good work!",
        environmentalImpact: {
          co2Reduced: `${totalItems * 20} kg`,
          waterSaved: `${totalItems * 1000} liters`,
          energySaved: `${totalItems * 50} kWh`
        },
        recommendations: [
          "Consider recycling more diverse types of electronics",
          "Schedule regular recycling pickups to maximize impact",
          "Encourage friends and family to recycle their e-waste too"
        ],
        achievementUnlocked: "E-Waste Warrior",
        nextMilestone: `Recycle ${totalItems + 5} items to reach the next level`
      };
    }

    // Create the response
    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-recycling-impact function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to analyze recycling impact" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
