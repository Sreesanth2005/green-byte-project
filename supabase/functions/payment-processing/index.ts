
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Store OTPs with expiration time (5 minutes)
const otpStore = new Map();

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userId, amount, paymentDetails } = await req.json();
    
    if (action === 'send-otp') {
      // In a real implementation, this would send an SMS or email with the OTP
      // For demo purposes, we'll just generate and store it
      const otp = generateOTP();
      const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes
      
      // Store OTP with userId as key
      otpStore.set(userId, { otp, expirationTime });
      
      // In a real implementation, send the OTP via SMS using a service like Twilio
      console.log(`Generated OTP for user ${userId}: ${otp}`);
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "OTP sent successfully. For demo purposes, check function logs.",
        // In a real app, don't return the OTP directly
        demoOtp: otp
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } 
    else if (action === 'verify-otp') {
      const { otp } = await req.json();
      const storedData = otpStore.get(userId);
      
      if (!storedData) {
        return new Response(JSON.stringify({ 
          success: false, 
          message: "No OTP found for this user. Please request a new one." 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (Date.now() > storedData.expirationTime) {
        otpStore.delete(userId);
        return new Response(JSON.stringify({ 
          success: false, 
          message: "OTP expired. Please request a new one." 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (storedData.otp !== otp) {
        return new Response(JSON.stringify({ 
          success: false, 
          message: "Invalid OTP. Please try again." 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // OTP verified, continue with the transaction
      otpStore.delete(userId);
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "OTP verified successfully." 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    else if (action === 'process-payment') {
      // For credits to money conversion
      const { transactionType, accountInfo, convertAmount } = await req.json();
      
      // In a real implementation, this would connect to a payment processor API
      // For demo purposes, we'll simulate a successful payment
      
      let description, transactionAmount, transactionType2;
      
      if (transactionType === 'credits-to-money') {
        // Converting eco credits to money
        // 10 eco credits = 1 Rupee
        const rupeesAmount = Math.floor(convertAmount / 10);
        
        // Update user's eco credits
        const { error: updateError } = await supabase.rpc('add_eco_credits', {
          user_id: userId,
          amount: -convertAmount // Subtract credits
        });
        
        if (updateError) throw updateError;
        
        description = `Converted ${convertAmount} EcoCredits to ₹${rupeesAmount} (${accountInfo})`;
        transactionAmount = convertAmount;
        transactionType2 = 'Withdrawn';
      } 
      else { // money-to-credits
        // Converting money to eco credits
        // 1 Rupee = 10 eco credits
        const creditsAmount = convertAmount * 10;
        
        // Update user's eco credits
        const { error: updateError } = await supabase.rpc('add_eco_credits', {
          user_id: userId,
          amount: creditsAmount // Add credits
        });
        
        if (updateError) throw updateError;
        
        description = `Added ${creditsAmount} EcoCredits from ₹${convertAmount} payment`;
        transactionAmount = creditsAmount;
        transactionType2 = 'Added';
      }
      
      // Record the transaction
      const paymentReference = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: transactionType2,
          amount: transactionAmount,
          description: description,
          payment_reference: paymentReference,
          status: 'completed'
        });
        
      if (transactionError) throw transactionError;
      
      return new Response(JSON.stringify({ 
        success: true, 
        reference: paymentReference,
        message: "Transaction processed successfully." 
      }), {
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
