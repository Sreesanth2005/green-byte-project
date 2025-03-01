
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// For demo purposes, we'll store OTPs in memory
// In a production environment, you would use a database with expiration
const otpStore = new Map();

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userId, phone, otp } = await req.json();
    
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

    // Generate OTP
    if (action === 'generate') {
      if (!phone) {
        return new Response(
          JSON.stringify({ error: "Phone number is required" }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      // Generate a 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP with expiration (5 minutes)
      const expiresAt = Date.now() + 5 * 60 * 1000;
      otpStore.set(userId, { otp: generatedOtp, expiresAt });
      
      // In a real application, you would send the OTP via SMS
      // For this demo, we'll just return it in the response
      console.log(`Generated OTP for user ${userId}: ${generatedOtp}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "OTP generated successfully",
          // Only for demo purposes - in production you would NEVER send this back!
          demo_otp: generatedOtp
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Verify OTP
    if (action === 'verify') {
      if (!otp) {
        return new Response(
          JSON.stringify({ error: "OTP is required" }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      const storedData = otpStore.get(userId);
      
      if (!storedData) {
        return new Response(
          JSON.stringify({ error: "No OTP found for this user. Please generate a new OTP." }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      // Check if OTP has expired
      if (Date.now() > storedData.expiresAt) {
        otpStore.delete(userId);
        return new Response(
          JSON.stringify({ error: "OTP has expired. Please generate a new OTP." }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      // Verify OTP
      if (otp !== storedData.otp) {
        return new Response(
          JSON.stringify({ error: "Invalid OTP. Please try again." }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      // OTP verified successfully
      otpStore.delete(userId);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "OTP verified successfully" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'generate' or 'verify'." }),
      { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in verify-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process OTP request" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
