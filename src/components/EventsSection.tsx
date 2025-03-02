
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";

const EventsSection = () => {
  const events = [
    {
      title: "E-Waste Collection Drive",
      date: "March 15, 2024",
      location: "Central Park, New York",
      image: "https://images.unsplash.com/photo-1576267423048-15c0040fec78?w=800&h=400&fit=crop",
      description: "Join us for our biggest e-waste collection event of the year. Bring your old electronics and earn extra EcoCredits!",
    },
    {
      title: "Sustainability Workshop",
      date: "March 20, 2024",
      location: "Tech Hub, San Francisco",
      image: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=800&h=400&fit=crop",
      description: "Learn about sustainable technology practices and how to reduce your electronic waste footprint.",
    },
    {
      title: "Community Recycling Day",
      date: "March 25, 2024",
      location: "Civic Center, Chicago",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=400&fit=crop",
      description: "A community event focused on electronics recycling education and collection.",
    },
  ];

  return (
    <section className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join us at our upcoming events and be part of the e-waste revolution.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.title} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                </div>
                <Button className="w-full mt-4">Register Now</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
