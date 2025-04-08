
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import mockDatabase, { MockEvent } from "@/utils/mockDatabase";
import { Calendar, Clock, MapPin, Users, Award, ArrowLeft } from "lucide-react";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<MockEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchEvent(id);
    }
  }, [id]);
  
  useEffect(() => {
    if (user && event) {
      checkIfRegistered();
    }
  }, [user, event]);

  const fetchEvent = async (eventId: string) => {
    try {
      setLoading(true);
      
      const { event, error } = mockDatabase.getEventById(eventId);
      
      if (error) throw new Error(error);
      
      if (event) {
        setEvent(event);
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      toast({
        title: "Failed to load event",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const checkIfRegistered = () => {
    if (!user || !event) return;
    
    const userData = mockDatabase.getUserById(user.id).user;
    if (!userData) return;
    
    setIsRegistered(userData.registeredEvents.includes(event.id));
  };

  const handleRegister = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to register for this event.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!event || !id) {
      toast({
        title: "Error",
        description: "Event information is missing.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setRegistering(true);
      
      const result = mockDatabase.registerForEvent(user.id, id);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setIsRegistered(true);
      
      toast({
        title: "Registration successful",
        description: result.message || "You have successfully registered for this event.",
      });
      
      // Refresh the event data and user data
      fetchEvent(id);
      refreshUser();
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred while registering.",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/events">Back to Events</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <Link to="/events" className="inline-flex items-center text-primary mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Events
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-auto rounded-2xl mb-6"
            />
            
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{event.title}</h1>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <div className="font-medium">Date</div>
                    <div className="text-gray-600">{event.date}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <div className="font-medium">Time</div>
                    <div className="text-gray-600">{event.time}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-gray-600">{event.location}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <div className="font-medium">Participants</div>
                    <div className="text-gray-600">
                      {event.currentParticipants} / {event.maxParticipants || 'Unlimited'} Registered
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <div className="font-medium">Eco Credits Reward</div>
                    <div className="text-gray-600">{event.ecoCreditsReward} credits upon participation</div>
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">About this Event</h2>
              <p className="text-gray-600 mb-8">{event.description}</p>
              
              <h2 className="text-xl font-semibold mb-4">Organizer</h2>
              <p className="text-gray-600">{event.organizer}</p>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Registration</h2>
              
              {isRegistered ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="font-medium text-green-800 mb-1">You're registered!</div>
                  <p className="text-sm text-green-700">
                    You've successfully registered for this event. You'll earn {event.ecoCreditsReward} Eco Credits after attending.
                  </p>
                </div>
              ) : event.maxParticipants > 0 && event.currentParticipants >= event.maxParticipants ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="font-medium text-red-800 mb-1">Event is full</div>
                  <p className="text-sm text-red-700">
                    Unfortunately, this event has reached its maximum capacity.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-primary">{event.ecoCreditsReward} Credits</div>
                    <div className="text-sm text-gray-600">Rewarded upon participation</div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="mb-2 font-medium">Event Type</div>
                    <div className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full inline-block">
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="mb-2 font-medium">Spots Remaining</div>
                    <div>
                      {event.maxParticipants ? (
                        `${event.maxParticipants - event.currentParticipants} out of ${event.maxParticipants}`
                      ) : (
                        'Unlimited'
                      )}
                    </div>
                  </div>
                </>
              )}
              
              <Button 
                className="w-full" 
                disabled={isRegistered || registering || (event.maxParticipants > 0 && event.currentParticipants >= event.maxParticipants)}
                onClick={handleRegister}
              >
                {registering ? "Registering..." : 
                  isRegistered ? "Already Registered" : 
                  event.maxParticipants > 0 && event.currentParticipants >= event.maxParticipants ? "Event Full" :
                  "Register for Event"}
              </Button>
              
              {!user && (
                <p className="mt-2 text-sm text-gray-500 text-center">
                  You need to <Link to="/login" className="text-primary hover:underline">log in</Link> to register for events
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;
