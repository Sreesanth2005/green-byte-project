
import React from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Recycle, Award, Calendar } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/90 to-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 bg-[length:20px_20px] opacity-10"></div>
          <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Recycle E-Waste, Earn Rewards
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mb-8">
              Join our community to safely dispose of electronic waste, earn EcoCredits, 
              and make a positive impact on the environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/schedule-pickup">Schedule a Pickup</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                <Link to="/marketplace">Browse Marketplace</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">How Green Byte Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Recycle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Recycle E-Waste</h3>
                <p className="text-gray-600">
                  Schedule a pickup for your e-waste or find drop-off locations near you. We handle 
                  proper recycling of all electronic devices.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Earn EcoCredits</h3>
                <p className="text-gray-600">
                  Receive EcoCredits based on the type and quantity of e-waste you recycle. Track your 
                  environmental impact in real-time.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Join Events</h3>
                <p className="text-gray-600">
                  Participate in community events, workshops, and initiatives focused on sustainability 
                  and environmental awareness.
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
