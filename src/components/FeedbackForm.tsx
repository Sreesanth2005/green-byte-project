
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const FeedbackForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Load user data if available
  useState(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim();
          if (fullName) setName(fullName);
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
    
    if (!name || !email || !rating || !message) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await supabase.functions.invoke('events-management', {
        body: {
          action: 'submit-feedback',
          userId: user?.id, // Optional
          name,
          email,
          rating,
          message
        }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to submit feedback");
      }
      
      // Clear form
      setRating(0);
      setMessage("");
      
      // Only clear name and email if not logged in
      if (!user) {
        setName("");
        setEmail("");
      }
      
      toast({
        title: "Thank you for your feedback!",
        description: user ? "You've earned 20 EcoCredits for your contribution." : "We appreciate your input.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to submit feedback. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Share Your Feedback</CardTitle>
        <CardDescription>Help us improve our service with your valuable input</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
            />
          </div>
          
          <div>
            <Label>Rating</Label>
            <div className="flex items-center mt-1 space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts with us"
              rows={4}
              required
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FeedbackForm;
