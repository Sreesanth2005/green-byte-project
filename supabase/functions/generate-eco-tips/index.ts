
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const { category } = await req.json();
    
    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY") || "");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create prompt based on category
    const prompt = `Generate 5 practical and informative eco-friendly tips related to ${category || 'electronic waste recycling'}. 
    Each tip should be concise (under 100 characters), actionable, and focused on environmental sustainability. 
    Format the output as a JSON array of strings.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Try to parse the response as JSON
    let tips;
    try {
      // The model might return a code block with ```json ``` markers, so try to extract the JSON
      const jsonMatch = text.match(/```json\s*(\[[\s\S]*?\])\s*```/) || 
                         text.match(/```\s*(\[[\s\S]*?\])\s*```/) ||
                         text.match(/(\[[\s\S]*?\])/);
      
      if (jsonMatch && jsonMatch[1]) {
        tips = JSON.parse(jsonMatch[1]);
      } else {
        // If no JSON format is detected, split by newlines and clean up
        tips = text.split('\n')
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .filter(line => line.length > 0);
      }
    } catch (e) {
      console.error("Error parsing Gemini response as JSON:", e);
      // Fallback: split by newlines and clean up
      tips = text.split('\n')
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0);
    }

    // Create the response
    return new Response(JSON.stringify({ tips }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-eco-tips function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate eco tips" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
