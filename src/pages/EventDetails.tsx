
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Share2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import EventRegistrationForm from "@/components/EventRegistrationForm";
import { useAuth } from "@/contexts/AuthContext";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchEvent(id);
      if (user) {
        checkRegistrationStatus(id);
      }
    }
  }, [id, user]);

  const fetchEvent = async (eventId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
        
      if (error) throw error;
      
      setEvent(data);
    } catch (error) {
      console.error("Error fetching event:", error);
      toast({
        title: "Failed to load event",
        description: "Please try again or go back to events list.",
        variant: "destructive",
      });
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async (eventId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is fine
        console.error("Error checking registration status:", error);
      }
      
      setIsRegistered(!!data);
    } catch (error) {
      console.error("Error checking registration status:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: `Check out this event: ${event?.title}`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share it with others!",
      });
    }
  };

  const handleRegisterClick = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to register for this event.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    setShowRegistrationForm(true);
  };

  const handleRegistrationSuccess = () => {
    setIsRegistered(true);
    setShowRegistrationForm(false);
    
    // Refresh event details to update participant count
    if (id) {
      fetchEvent(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-6 pt-24 pb-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Event not found</h3>
            <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/events')}>Back to Events</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/events')} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={event.image_url || "https://images.unsplash.com/photo-1516397281156-ca3b5d4c8744?w=800&h=600&fit=crop"} 
                alt={event.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="p-8 md:w-1/2">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
                <Button variant="ghost" size="icon" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  <span>{formatDate(event.event_date)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3 text-primary" />
                  <span>{event.event_time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3 text-primary" />
                  <span>{event.location}</span>
                </div>
                {event.max_participants && (
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-3 text-primary" />
                    <span>{event.current_participants} / {event.max_participants} participants</span>
                  </div>
                )}
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">About this event</h3>
                <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
              </div>
              
              <div>
                {isRegistered ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-green-700 font-medium">You're registered for this event!</p>
                    <p className="text-sm text-green-600 mt-1">We look forward to seeing you there.</p>
                  </div>
                ) : event.max_participants && event.current_participants >= event.max_participants ? (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                    <p className="text-orange-700 font-medium">This event is at full capacity</p>
                    <p className="text-sm text-orange-600 mt-1">Please check other events.</p>
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleRegisterClick}
                  >
                    Register for this Event
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <EventRegistrationForm 
          event={event}
          onClose={() => setShowRegistrationForm(false)}
          onSuccess={handleRegistrationSuccess}
        />
      )}

      <Footer />
    </div>
  );
};

export default EventDetails;
