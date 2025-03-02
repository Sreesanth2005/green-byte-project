
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, Users, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import EventRegistrationForm from "@/components/EventRegistrationForm";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  max_participants: number;
  current_participants: number;
  image_url: string;
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    if (id) {
      fetchEventDetails();
      if (user) {
        checkRegistrationStatus();
      }
    }
  }, [id, user]);
  
  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      setEvent(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching event details",
        description: error.message
      });
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };
  
  const checkRegistrationStatus = async () => {
    if (!user || !id) return;
    
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setIsRegistered(data && data.length > 0);
    } catch (error: any) {
      console.error("Error checking registration status:", error);
    }
  };
  
  const handleRegistrationSuccess = () => {
    setIsRegistered(true);
    setShowRegistrationForm(false);
    fetchEventDetails(); // Refresh event details to update participant count
    
    toast({
      title: "Registration Successful!",
      description: "You've been registered for this event and earned 50 EcoCredits!",
    });
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
        <main className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <p className="mb-8">The event you're looking for may have been removed or doesn't exist.</p>
          <Button onClick={() => navigate('/events')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => navigate('/events')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
        </Button>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="h-64 md:h-96 overflow-hidden relative">
            <img 
              src={event.image_url || "/placeholder.svg"} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 md:p-8 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(event.event_date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{event.event_time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <h2 className="text-xl font-semibold mb-4">About This Event</h2>
                <div className="prose max-w-none">
                  <p>{event.description}</p>
                </div>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">What You'll Gain</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Learn about proper e-waste disposal techniques</li>
                  <li>Network with other environmentally conscious individuals</li>
                  <li>Contribute to reducing electronic waste in landfills</li>
                  <li>Earn 50 EcoCredits for participating</li>
                </ul>
              </div>
              
              <div className="md:w-1/3 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-gray-600">{formatDate(event.event_date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-gray-600">{event.event_time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="h-5 w-5 mr-3 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Participants</p>
                      <p className="text-gray-600">
                        {event.current_participants} out of {event.max_participants} registered
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${(event.current_participants / event.max_participants) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {isRegistered ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-green-800 font-medium">You're registered!</p>
                    <p className="text-green-600 text-sm mt-1">We look forward to seeing you at the event.</p>
                  </div>
                ) : (
                  event.current_participants >= event.max_participants ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                      <p className="text-yellow-800 font-medium">Event is full</p>
                      <p className="text-yellow-600 text-sm mt-1">Please check out our other events.</p>
                    </div>
                  ) : (
                    <>
                      {showRegistrationForm ? (
                        <EventRegistrationForm 
                          eventId={event.id} 
                          onSuccess={handleRegistrationSuccess} 
                          onCancel={() => setShowRegistrationForm(false)}
                        />
                      ) : (
                        <Button 
                          className="w-full"
                          onClick={() => user ? setShowRegistrationForm(true) : navigate('/login')}
                        >
                          {user ? "Register Now" : "Login to Register"}
                        </Button>
                      )}
                      
                      {!user && (
                        <p className="text-center text-sm text-gray-500 mt-4">
                          You need to be logged in to register for this event.
                        </p>
                      )}
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventDetails;
