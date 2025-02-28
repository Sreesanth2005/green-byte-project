
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentVerificationRequest {
  orderId: string;
  paymentId: string;
  signature: string;
  userId: string;
  amount: number;
  description: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const { orderId, paymentId, signature, userId, amount, description }: PaymentVerificationRequest = await req.json();

    // In a real production environment, you would verify the payment with Razorpay
    // using the signature and payment details
    // This is a simplified mock verification for development
    
    console.log('Verifying payment:', { orderId, paymentId, userId, amount });
    
    // Mock verification - always consider it valid in this example
    const isValid = true;
    
    if (!isValid) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid payment signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    
    // Convert rupees to credits (10 credits per rupee)
    const credits = amount * 10;
    
    // Create a transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'converted_to_credits',
        amount: credits,
        description: description || `Payment of ₹${amount}`,
        payment_id: paymentId,
        order_id: orderId,
      });
    
    if (transactionError) {
      throw new Error(`Transaction error: ${transactionError.message}`);
    }
    
    // Update user's eco-credits
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('eco_credits')
      .eq('id', userId)
      .single();
    
    if (userError) {
      throw new Error(`User fetch error: ${userError.message}`);
    }
    
    const newCreditBalance = (userData?.eco_credits || 0) + credits;
    
    const { error: updateError } = await supabase
      .from('users')
      .update({ eco_credits: newCreditBalance })
      .eq('id', userId);
    
    if (updateError) {
      throw new Error(`Update error: ${updateError.message}`);
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Payment verified and credits added', 
      newBalance: newCreditBalance 
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error('Error in verify-payment function:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
