
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action } = await req.json();
    
    if (action === 'register-for-event') {
      const { userId, eventId, firstName, lastName, email, phone } = await req.json();
      
      // Check if event exists and has space
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
        
      if (eventError) throw eventError;
      
      if (event.current_participants >= event.max_participants) {
        return new Response(JSON.stringify({ 
          success: false, 
          message: "This event is full. Please try another event." 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Check if user is already registered
      const { data: existingReg, error: regCheckError } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', userId);
        
      if (regCheckError) throw regCheckError;
      
      if (existingReg && existingReg.length > 0) {
        return new Response(JSON.stringify({ 
          success: false, 
          message: "You are already registered for this event." 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Register the user
      const { data: registration, error: regError } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone
        })
        .select();
        
      if (regError) throw regError;
      
      // Update event participant count
      const { error: updateError } = await supabase
        .from('events')
        .update({ current_participants: event.current_participants + 1 })
        .eq('id', eventId);
        
      if (updateError) throw updateError;
      
      // Award eco credits for registration
      const { error: creditsError } = await supabase.rpc('add_eco_credits', {
        user_id: userId,
        amount: 50 // Award 50 eco credits for registering
      });
      
      if (creditsError) throw creditsError;
      
      // Record the transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'Earned',
          amount: 50,
          description: `Registered for event: ${event.title}`
        });
        
      if (transactionError) throw transactionError;
      
      return new Response(JSON.stringify({ 
        success: true, 
        registration: registration[0],
        message: "Successfully registered for the event and earned 50 EcoCredits!" 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    else if (action === 'submit-feedback') {
      const { userId, name, email, rating, message } = await req.json();
      
      // Save feedback
      const { data: feedback, error: feedbackError } = await supabase
        .from('feedback')
        .insert({
          user_id: userId,
          name: name,
          email: email,
          rating: rating,
          message: message
        })
        .select();
        
      if (feedbackError) throw feedbackError;
      
      // Award eco credits for feedback
      if (userId) {
        const { error: creditsError } = await supabase.rpc('add_eco_credits', {
          user_id: userId,
          amount: 20 // Award 20 eco credits for feedback
        });
        
        if (creditsError) throw creditsError;
        
        // Record the transaction
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            user_id: userId,
            type: 'Earned',
            amount: 20,
            description: 'Submitted feedback'
          });
          
        if (transactionError) throw transactionError;
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        feedback: feedback[0],
        message: userId ? "Thank you for your feedback! You earned 20 EcoCredits." : "Thank you for your feedback!" 
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
