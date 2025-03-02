
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
    const { action, eventId, userId, registrationData } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Handle different actions
    if (action === "register") {
      // Check if the event exists and has space
      const { data: event, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();
      
      if (eventError) {
        return new Response(JSON.stringify({ error: "Event not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // Check if event is full
      if (event.max_participants && event.current_participants >= event.max_participants) {
        return new Response(JSON.stringify({ error: "Event is full" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // Check if user is already registered
      const { data: existingRegistration, error: registrationError } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", userId);
      
      if (existingRegistration && existingRegistration.length > 0) {
        return new Response(JSON.stringify({ error: "You are already registered for this event" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // Create the registration
      const { data: registration, error: insertError } = await supabase
        .from("event_registrations")
        .insert({
          event_id: eventId,
          user_id: userId,
          first_name: registrationData.firstName,
          last_name: registrationData.lastName,
          email: registrationData.email,
          phone: registrationData.phone
        })
        .select();
      
      if (insertError) {
        return new Response(JSON.stringify({ error: "Failed to register for event" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // Increment the participant count
      const { error: updateError } = await supabase
        .from("events")
        .update({ current_participants: event.current_participants + 1 })
        .eq("id", eventId);
      
      if (updateError) {
        console.error("Error updating participant count:", updateError);
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Successfully registered for event",
        registration: registration[0]
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } 
    else if (action === "cancel") {
      // Check if the registration exists
      const { data: registration, error: registrationError } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", userId)
        .single();
      
      if (registrationError) {
        return new Response(JSON.stringify({ error: "Registration not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // Delete the registration
      const { error: deleteError } = await supabase
        .from("event_registrations")
        .delete()
        .eq("id", registration.id);
      
      if (deleteError) {
        return new Response(JSON.stringify({ error: "Failed to cancel registration" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // Decrement the participant count
      const { data: event, error: eventError } = await supabase
        .from("events")
        .select("current_participants")
        .eq("id", eventId)
        .single();
      
      if (!eventError) {
        const { error: updateError } = await supabase
          .from("events")
          .update({ current_participants: Math.max(0, event.current_participants - 1) })
          .eq("id", eventId);
        
        if (updateError) {
          console.error("Error updating participant count:", updateError);
        }
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Successfully canceled registration"
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error managing event:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
