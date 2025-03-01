
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    const { 
      userId, 
      amount, 
      direction, // 'toCredits' or 'toRupees'
      paymentDetails = {} 
    } = await req.json();
    
    if (!userId || !amount || !direction) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: userId, amount, direction" }),
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

    // In a real application, this would integrate with a payment gateway
    // For this demo, we'll simulate the payment process
    const paymentReference = `PYT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Convert amount to credits (1 Rupee = 10 EcoCredits)
    const creditAmount = direction === 'toCredits' ? amount * 10 : amount;
    const rupeeAmount = direction === 'toCredits' ? amount : amount / a0;
    
    // Update user's eco-credits
    let transactionType, transactionDescription;
    
    if (direction === 'toCredits') {
      // Add credits to user's account
      await supabase.rpc('add_eco_credits', {
        user_id: userId,
        amount: creditAmount
      });
      transactionType = 'Added';
      transactionDescription = `Converted ₹${rupeeAmount} to ${creditAmount} EcoCredits`;
    } else {
      // Check if user has enough credits
      const { data: profile } = await supabase
        .from('profiles')
        .select('eco_credits')
        .eq('id', userId)
        .single();
        
      if (!profile || profile.eco_credits < creditAmount) {
        return new Response(
          JSON.stringify({ error: "Insufficient eco-credits" }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      // Remove credits from user's account
      await supabase.rpc('add_eco_credits', {
        user_id: userId,
        amount: -creditAmount
      });
      transactionType = 'Withdrawn';
      transactionDescription = `Converted ${creditAmount} EcoCredits to ₹${rupeeAmount}`;
    }
    
    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: userId,
          type: transactionType,
          amount: creditAmount,
          description: transactionDescription,
          payment_reference: paymentReference,
          status: 'completed'
        }
      ])
      .select()
      .single();
      
    if (transactionError) {
      throw new Error(`Error creating transaction: ${transactionError.message}`);
    }

    // Return successful response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully ${direction === 'toCredits' ? 'added' : 'withdrawn'} eco-credits`,
        transaction,
        paymentReference
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in process-payment function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process payment" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
