
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";

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
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(JSON.stringify({ error: "Missing Supabase environment variables" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { action, userId, otp, amount, direction, accountNumber, upiId, paymentMethod } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (profileError) {
      return new Response(JSON.stringify({ error: "User profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Handle different actions
    if (action === "send-otp") {
      // In a real app, we would send an OTP to the user's phone
      // For this demo, we'll simulate OTP generation
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in a secure table with expiration
      // For demo purposes, we'll return it directly
      
      console.log(`OTP for user ${userId}: ${generatedOtp}`);
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "OTP sent successfully",
        otp: generatedOtp // In production, never return the OTP in the response
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } 
    else if (action === "verify-otp") {
      // In a real app, we would verify the OTP against what was sent
      // For this demo, we'll simulate verification
      
      // Assume OTP is valid, process the transaction
      if (direction === "add") {
        // Convert money to eco credits
        const ecoCreditsToAdd = amount * 100; // 1 USD = 100 eco credits
        
        // Update user's eco credits
        const { data, error } = await supabase.rpc("add_eco_credits", {
          user_id: userId,
          amount: ecoCreditsToAdd
        });
        
        if (error) {
          console.error("Error adding eco credits:", error);
          return new Response(JSON.stringify({ error: "Failed to add eco credits" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        // Record the transaction
        const { error: transactionError } = await supabase
          .from("transactions")
          .insert({
            user_id: userId,
            type: "credit",
            amount: ecoCreditsToAdd,
            description: `Added ${ecoCreditsToAdd} eco credits via ${paymentMethod}`,
            payment_reference: `PAY-${Date.now()}`,
            status: "completed"
          });
        
        if (transactionError) {
          console.error("Error recording transaction:", transactionError);
        }
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: "Eco credits added successfully",
          new_balance: (profile.eco_credits || 0) + ecoCreditsToAdd
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } 
      else if (direction === "withdraw") {
        // Check if user has enough eco credits
        if ((profile.eco_credits || 0) < amount) {
          return new Response(JSON.stringify({ error: "Insufficient eco credits" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        // Convert eco credits to money
        const moneyToWithdraw = amount / 100; // 100 eco credits = 1 USD
        
        // Update user's eco credits
        const { data, error } = await supabase.rpc("add_eco_credits", {
          user_id: userId,
          amount: -amount
        });
        
        if (error) {
          console.error("Error deducting eco credits:", error);
          return new Response(JSON.stringify({ error: "Failed to process withdrawal" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        // Record the transaction
        const { error: transactionError } = await supabase
          .from("transactions")
          .insert({
            user_id: userId,
            type: "debit",
            amount: amount,
            description: `Withdrew ${amount} eco credits (${moneyToWithdraw} USD)`,
            payment_reference: accountNumber || upiId || `WIT-${Date.now()}`,
            status: "processing" // In a real app, this would be updated once the money transfer is complete
          });
        
        if (transactionError) {
          console.error("Error recording transaction:", transactionError);
        }
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: "Withdrawal processed successfully",
          new_balance: (profile.eco_credits || 0) - amount
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
    
    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
