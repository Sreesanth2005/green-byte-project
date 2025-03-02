
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  image_url: string;
  max_participants: number;
  current_participants: number;
}

const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .limit(3)
        .order('event_date', { ascending: true });
        
      if (error) throw error;
      
      setEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load events. Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleRegisterClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <section className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join us at our upcoming events and be part of the e-waste revolution.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={event.image_url || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(event.event_date)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    {event.current_participants}/{event.max_participants} registered
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => handleRegisterClick(event.id)}
                    disabled={event.current_participants >= event.max_participants}
                  >
                    {event.current_participants >= event.max_participants
                      ? "Event Full"
                      : "Register Now"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No upcoming events found.</p>
            <Button className="mt-4" variant="outline" asChild>
              <Link to="/events">View All Events</Link>
            </Button>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
