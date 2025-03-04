
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";

const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })
        .limit(3);
        
      if (error) throw error;
      
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events. Please try again later.",
        variant: "destructive",
      });
      // Use fallback data if fetch fails
      setEvents([
        {
          id: "1",
          title: "E-Waste Collection Drive",
          event_date: "2024-03-15",
          location: "Central Park, New York",
          image_url: "https://images.unsplash.com/photo-1576267423048-15c0040fec78?w=800&h=400&fit=crop",
          description: "Join us for our biggest e-waste collection event of the year. Bring your old electronics and earn extra EcoCredits!",
        },
        {
          id: "2",
          title: "Sustainability Workshop",
          event_date: "2024-03-20",
          location: "Tech Hub, San Francisco",
          image_url: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=800&h=400&fit=crop",
          description: "Learn about sustainable technology practices and how to reduce your electronic waste footprint.",
        },
        {
          id: "3",
          title: "Community Recycling Day",
          event_date: "2024-03-25",
          location: "Civic Center, Chicago",
          image_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=400&fit=crop",
          description: "A community event focused on electronics recycling education and collection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric' as const, month: 'long' as const, day: 'numeric' as const };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-semibold text-xl mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(event.event_date)}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <Button asChild variant="outline" className="flex-1">
                        <Link to={`/event/${event.id}`}>
                          Learn More
                        </Link>
                      </Button>
                      <Button asChild className="flex-1">
                        <Link to={`/event/${event.id}?register=true`}>
                          Register Now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-12">
              <Button asChild size="lg">
                <Link to="/events" className="flex items-center">
                  More Events
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
