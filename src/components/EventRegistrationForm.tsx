
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

interface EventRegistrationFormProps {
  eventId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const EventRegistrationForm = ({ eventId, onSuccess, onCancel }: EventRegistrationFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { user } = useAuth();
  
  // Load user data if available
  useState(() => {
    const loadUserData = async () => {
      if (!user) return;
      
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
        
        if (user.email) {
          setEmail(user.email);
        }
      } catch (err) {
        console.error("Error loading user data:", err);
      }
    };
    
    loadUserData();
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError("You need to be logged in to register");
      return;
    }
    
    if (!firstName || !lastName || !email) {
      setError("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await supabase.functions.invoke('events-management', {
        body: {
          action: 'register-for-event',
          userId: user.id,
          eventId,
          firstName,
          lastName,
          email,
          phone
        }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Registration failed");
      }
      
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="firstName">First Name *</Label>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="lastName">Last Name *</Label>
        <Input
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      
      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}
      
      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Complete Registration"}
        </Button>
      </div>
    </form>
  );
};

export default EventRegistrationForm;
