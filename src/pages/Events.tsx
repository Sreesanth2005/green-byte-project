
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MapPin, Users, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import mockDatabase, { MockEvent } from "@/utils/mockDatabase";

const Events = () => {
  const [events, setEvents] = useState<MockEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  
  const eventTypes = ["all", "collection", "workshop", "conference", "competition"];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { events } = mockDatabase.getAllEvents();
      setEvents(events);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    // Filter by type
    const typeMatch = selectedType === "all" || event.type === selectedType;
    
    // Filter by search query
    const searchMatch = !searchQuery ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-16">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Join Our Community Events
              </h1>
              <p className="text-white/90 mb-8">
                Participate in our e-waste collection drives, workshops, and community initiatives. 
                Learn about sustainable electronics and earn eco-credits while making a positive impact.
              </p>
              <div className="relative max-w-md">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events..."
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6">
          {/* Event Type Filters */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {eventTypes.map(type => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  onClick={() => setSelectedType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Events List */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredEvents.map(event => (
                <Link key={event.id} to={`/event/${event.id}`} className="block">
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="mb-2">
                        <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                      <div className="mt-auto space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="mr-2 h-4 w-4" />
                          {event.date} • {event.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="mr-2 h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="mr-2 h-4 w-4" />
                            {event.currentParticipants} / {event.maxParticipants || '∞'}
                          </div>
                          <div className="text-sm font-medium text-primary">
                            +{event.ecoCreditsReward} Credits
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 border-t">
                      <Button className="w-full">View Details</Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-2">No events found</h2>
              <p className="text-gray-600 mb-8">Try adjusting your filters or check back later for new events.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Events;
