
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Clock, Users, Search } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";

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

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate();
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
        .order('event_date', { ascending: true });
        
      if (error) throw error;
      
      setEvents(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching events",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Upcoming E-waste Events</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join our community events to learn more about e-waste recycling, 
            participate in collection drives, and connect with like-minded individuals.
          </p>
        </div>
        
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search events by title, location, or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold">No events found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm 
                ? `No events match your search for "${searchTerm}"`
                : "There are no upcoming events at the moment. Check back soon!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={event.image_url || "/placeholder.svg"} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                    {event.current_participants >= event.max_participants
                      ? "Fully Booked"
                      : `${event.current_participants}/${event.max_participants} Registered`}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span>{event.event_time}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <span>
                        {event.current_participants} / {event.max_participants} participants
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => navigate(`/event/${event.id}`)}
                    disabled={event.current_participants >= event.max_participants}
                  >
                    {event.current_participants >= event.max_participants
                      ? "Event Full"
                      : "View Details & Register"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;
