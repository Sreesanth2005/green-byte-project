
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface EventRegistrationFormProps {
  event: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EventRegistrationForm = ({ event, onClose, onSuccess }: EventRegistrationFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Pre-fill form with user data if available
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setPhone(data.phone || "");
      }
      
      // Set email from auth
      setEmail(user.email || "");
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for this event.",
        variant: "destructive",
      });
      return;
    }
    
    if (!firstName || !lastName || !email) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Check if the event is already full
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('current_participants, max_participants')
        .eq('id', event.id)
        .single();
        
      if (eventError) throw eventError;
      
      if (eventData.max_participants && eventData.current_participants >= eventData.max_participants) {
        toast({
          title: "Event is full",
          description: "This event has reached its maximum capacity.",
          variant: "destructive",
        });
        return;
      }
      
      // Insert registration
      const { error: registrationError } = await supabase
        .from('event_registrations')
        .insert([
          {
            event_id: event.id,
            user_id: user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone
          }
        ]);
        
      if (registrationError) throw registrationError;
      
      // Update event participant count
      const { error: updateError } = await supabase
        .from('events')
        .update({ current_participants: eventData.current_participants + 1 })
        .eq('id', event.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Registration successful",
        description: "You have successfully registered for this event.",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error registering for event:", error);
      toast({
        title: "Registration failed",
        description: "There was an error registering for this event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Register for Event</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name*</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name*</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email*</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Complete Registration"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRegistrationForm;
