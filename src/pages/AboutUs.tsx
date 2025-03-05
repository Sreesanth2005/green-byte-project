
import React from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Leaf, Truck, Globe, Award, Heart } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative">
          <div className="w-full h-[400px] bg-gradient-to-r from-green-800 to-green-600">
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Recycling for a Sustainable Future</h1>
                <p className="text-xl md:text-2xl mb-8">GreenByte is on a mission to reduce e-waste and promote a circular economy</p>
                <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100">Join Our Mission</Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Mission */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-8">
              At GreenByte, we're committed to revolutionizing the way electronic waste is handled. 
              Our mission is to create a sustainable ecosystem where electronic devices are refurbished, 
              repurposed, and recycled responsibly, reducing the environmental impact of e-waste while creating 
              value for our community of eco-conscious consumers.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Recycle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Reduce E-Waste</h3>
                  <p className="text-gray-600">Diverting electronics from landfills to give them a second life</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Environmental Impact</h3>
                  <p className="text-gray-600">Reducing carbon footprint through responsible recycling</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Community Focus</h3>
                  <p className="text-gray-600">Building a network of environmentally conscious consumers</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 px-6 bg-green-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">How GreenByte Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">1</div>
                <h3 className="font-semibold text-xl mb-2">Schedule a Pickup</h3>
                <p className="text-gray-700">
                  Tell us what electronics you want to recycle, and we'll arrange a convenient pickup time.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">2</div>
                <h3 className="font-semibold text-xl mb-2">Earn EcoCredits</h3>
                <p className="text-gray-700">
                  Receive EcoCredits based on the value and condition of your recycled electronics.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">3</div>
                <h3 className="font-semibold text-xl mb-2">Shop Refurbished</h3>
                <p className="text-gray-700">
                  Use your EcoCredits to purchase quality-checked refurbished electronics at discounted prices.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Impact */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Impact</h2>
            <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
              Every device recycled through GreenByte contributes to a significant reduction in environmental impact. 
              Here's what we've achieved together with our community:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Recycle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary">5,000+</h3>
                <p className="text-gray-600">Devices Recycled</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary">120+</h3>
                <p className="text-gray-600">Tons of CO₂ Saved</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary">3,200+</h3>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary">250+</h3>
                <p className="text-gray-600">Local Pickups</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Team */}
        <section className="py-16 px-6 bg-gray-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-1">Rahul Sharma</h3>
                  <p className="text-primary mb-3">Founder & CEO</p>
                  <p className="text-gray-600">
                    With 15+ years in sustainability and tech, Rahul founded GreenByte to create a practical solution to the growing e-waste problem.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-1">Priya Patel</h3>
                  <p className="text-primary mb-3">Head of Operations</p>
                  <p className="text-gray-600">
                    Priya manages our recycling operations, ensuring efficient pickup services and quality control for all refurbished products.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-1">Arjun Mehta</h3>
                  <p className="text-primary mb-3">Sustainability Director</p>
                  <p className="text-gray-600">
                    Arjun oversees our environmental impact metrics and develops partnerships to expand our recycling initiatives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 px-6 bg-primary text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Join Our Green Revolution</h2>
            <p className="text-xl mb-8">
              Ready to make a difference? Start your recycling journey with GreenByte today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">Schedule a Pickup</Button>
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">Shop Refurbished</Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
