
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const geminiApiKey = Deno.env.get('GEMINI_API_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, category } = await req.json();
    
    if (action === 'generate-tip') {
      // Generate a new eco tip using Gemini AI
      const prompt = `Generate a short, practical tip about e-waste recycling${category ? ` focused on ${category}` : ''}. 
      The tip should be concise (under 150 characters), actionable, and educate users about responsible electronic waste disposal.
      Only return the tip text without any additional formatting or explanation.`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100,
          },
        }),
      });
      
      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("Failed to generate tip");
      }
      
      const tip = data.candidates[0].content.parts[0].text.trim();
      
      // Save the tip to the database
      const { data: savedTip, error } = await supabase
        .from('eco_tips')
        .insert({ tip, category: category || 'general' })
        .select()
        .single();
        
      if (error) throw error;
      
      return new Response(JSON.stringify({ tip: savedTip }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } 
    else if (action === 'get-tips') {
      // Get existing tips, optionally filtered by category
      let query = supabase.from('eco_tips').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data: tips, error } = await query.order('created_at', { ascending: false }).limit(10);
      
      if (error) throw error;
      
      return new Response(JSON.stringify({ tips }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    else if (action === 'analyze-impact') {
      // Generate impact analysis based on user's recycling data
      const { userId } = await req.json();
      
      // Get user's recycling data
      const { data: pickups, error: pickupsError } = await supabase
        .from('schedule_pickups')
        .select('*')
        .eq('user_id', userId);
        
      if (pickupsError) throw pickupsError;
      
      // Get user's profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) throw profileError;
      
      // Create prompt for Gemini AI
      const prompt = `
        Based on the following e-waste recycling data, generate a personalized environmental impact analysis:
        
        User Level: ${profile.level}
        Total Eco Credits: ${profile.eco_credits}
        Number of Recycled Items: ${pickups.length}
        
        Categories Recycled: ${[...new Set(pickups.map(p => p.category))].join(', ')}
        
        Please provide:
        1. An estimate of environmental impact (CO2 saved, water saved, etc.) 
        2. A comparison to everyday activities (e.g., "equivalent to planting X trees")
        3. A personalized suggestion for improving their recycling habits
        
        Format the response with clear sections, concise yet informative.
      `;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 512,
          },
        }),
      });
      
      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("Failed to generate analysis");
      }
      
      const analysis = data.candidates[0].content.parts[0].text;
      
      return new Response(JSON.stringify({ analysis }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
