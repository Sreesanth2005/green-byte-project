
import React from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Calendar, MessageSquare } from "lucide-react";
import FeedbackSection from "@/components/FeedbackSection";

const Home = () => {
  // Sample upcoming events data
  const upcomingEvents = [
    {
      id: 1,
      title: "E-Waste Collection Drive",
      date: "June 15, 2024",
      location: "Central Park, New York",
      description: "Join us for our biggest e-waste collection event of the year. Bring your old electronics and earn extra EcoCredits!"
    },
    {
      id: 2,
      title: "Sustainable Tech Workshop",
      date: "June 22, 2024",
      location: "Tech Hub, San Francisco",
      description: "Learn how to extend the life of your devices and make sustainable tech choices."
    },
    {
      id: 3,
      title: "Community Recycling Day",
      date: "July 8, 2024",
      location: "Community Center, Chicago",
      description: "A neighborhood initiative to promote responsible disposal of electronic waste."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">How Green Byte Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Recycle E-Waste</h3>
                <p className="text-gray-600">
                  Schedule a pickup for your e-waste or find drop-off locations near you. We handle 
                  proper recycling of all electronic devices.
                </p>
              </div>
              
              {/* Feature Card 2 */}
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0-2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Earn EcoCredits</h3>
                <p className="text-gray-600">
                  Receive EcoCredits based on the type and quantity of e-waste you recycle. Track your 
                  environmental impact in real-time.
                </p>
              </div>
              
              {/* Feature Card 3 */}
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Redeem Rewards</h3>
                <p className="text-gray-600">
                  Use your EcoCredits to purchase eco-friendly products, get discounts, or donate to 
                  environmental causes.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button asChild>
                <Link to="/about-us" className="flex items-center">
                  Learn more about us <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Events Section */}
        <section className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
              <div>
                <div className="flex items-center text-primary mb-2">
                  <Calendar className="mr-2 h-5 w-5" />
                  <span className="font-medium">Upcoming Events</span>
                </div>
                <h2 className="text-3xl font-bold">Join Our Community Events</h2>
              </div>
              <Button asChild className="mt-4 md:mt-0">
                <Link to="/events" className="flex items-center">
                  View all events <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:translate-y-[-5px]">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <div className="flex items-center text-gray-500 mb-1">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="text-gray-500 mb-4">
                      <span>{event.location}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/events">Learn more</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Feedback Section */}
        <FeedbackSection />
        
        {/* CTA Section */}
        <section className="bg-gray-100 py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Join thousands of users who are already reducing e-waste and earning rewards.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <Link to="/schedule-pickup">Get Started Today</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
