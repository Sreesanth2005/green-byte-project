import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Get environment variables
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
  
  if (!supabaseUrl || !supabaseServiceKey || !geminiApiKey) {
    return new Response(JSON.stringify({ error: "Missing environment variables" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { userId, category, timeFrame } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user data and pickup history
    let userData = null;
    let pickupData = null;
    
    if (userId) {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
      } else {
        userData = profile;
      }
      
      // Build query for pickup data
      let query = supabase
        .from("schedule_pickups")
        .select("*")
        .eq("user_id", userId);
      
      // Apply filters if provided
      if (category && category !== "all") {
        query = query.eq("category", category);
      }
      
      if (timeFrame) {
        const now = new Date();
        let fromDate = new Date();
        
        if (timeFrame === "week") {
          fromDate.setDate(now.getDate() - 7);
        } else if (timeFrame === "month") {
          fromDate.setMonth(now.getMonth() - 1);
        } else if (timeFrame === "year") {
          fromDate.setFullYear(now.getFullYear() - 1);
        }
        
        query = query.gte("pickup_date", fromDate.toISOString().split("T")[0]);
      }
      
      const { data: pickups, error: pickupsError } = await query;
      
      if (pickupsError) {
        console.error("Error fetching pickup data:", pickupsError);
      } else {
        pickupData = pickups;
      }
    } else {
      // Get overall statistics if no user ID provided
      const { data: pickups, error: pickupsError } = await supabase
        .from("schedule_pickups")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      
      if (pickupsError) {
        console.error("Error fetching pickup data:", pickupsError);
      } else {
        pickupData = pickups;
      }
    }
    
    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate analysis based on the data
    let analysisPrompt = `Analyze the following recycling data and provide insights:`;
    
    if (userData) {
      analysisPrompt += `\nUser Profile: ${JSON.stringify(userData)}`;
    }
    
    if (pickupData) {
      // Only send summary data to keep the prompt size manageable
      const categoryCounts = pickupData.reduce((acc, pickup) => {
        acc[pickup.category] = (acc[pickup.category] || 0) + 1;
        return acc;
      }, {});
      
      const totalEcoCredits = pickupData.reduce((sum, pickup) => 
        sum + (pickup.eco_credits_earned || 0), 0);
      
      analysisPrompt += `\nRecycling Summary:
      - Total Pickups: ${pickupData.length}
      - Categories: ${JSON.stringify(categoryCounts)}
      - Total Eco Credits Earned: ${totalEcoCredits}
      - Time Period: ${timeFrame || "all time"}`;
    }
    
    analysisPrompt += `\n\nPlease provide the following:
    1. A brief summary of the recycling impact
    2. Environmental benefits (CO2 reduction, water saved, trees saved, etc.)
    3. Suggestions for improvement
    4. A motivational message`;
    
    const result = await model.generateContent(analysisPrompt);
    const analysisText = result.response.text();
    
    // Return the analysis results
    return new Response(JSON.stringify({ 
      analysis: analysisText,
      userData,
      stats: {
        totalPickups: pickupData?.length || 0,
        ecoCreditsEarned: pickupData?.reduce((sum, pickup) => 
          sum + (pickup.eco_credits_earned || 0), 0) || 0
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error analyzing recycling impact:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
