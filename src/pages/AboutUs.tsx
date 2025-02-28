
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, MapPin, Recycle, Heart, Globe, UserCheck, Shield } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-primary/10 py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <img 
              src="/lovable-uploads/24b8d545-2e4e-42c1-9d48-3e0dd4888244.png" 
              alt="Green Byte Logo" 
              className="w-32 h-32 mx-auto mb-6"
            />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Mission</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Making e-waste recycling accessible, rewarding, and impactful for everyone.
            </p>
            <Button size="lg">
              Join Our Mission
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Our Story */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-4">
                Green Byte was founded in 2020 with a simple yet powerful vision: to transform the way we handle electronic waste and create a sustainable future for our planet.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                What started as a small community initiative in Bangalore quickly grew into a nationwide movement. We identified a critical gap in the e-waste management ecosystem – while people wanted to responsibly dispose of their electronic waste, the process was often inconvenient and unrewarding.
              </p>
              <p className="text-lg text-gray-600">
                Green Byte bridges this gap by making recycling convenient and rewarding through our innovative EcoCredits system. Today, we're proud to have processed over 24,000 kg of e-waste and continue to expand our impact across India.
              </p>
            </div>
            <div className="bg-gray-200 rounded-2xl h-80 md:h-96 flex items-center justify-center">
              <p className="text-gray-600">Company History Image</p>
            </div>
          </div>
        </div>
        
        {/* Core Values */}
        <div className="bg-white py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-50 p-6 rounded-2xl text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Recycle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Environmental Stewardship</h3>
                <p className="text-gray-600">We're committed to reducing e-waste and its environmental impact through responsible recycling practices.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-2xl text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Community Empowerment</h3>
                <p className="text-gray-600">We believe in empowering communities to take action and make a positive impact on the environment.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-2xl text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Global Impact</h3>
                <p className="text-gray-600">We think globally while acting locally, understanding that our actions have worldwide implications.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-2xl text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">User-Centric Approach</h3>
                <p className="text-gray-600">We design our services with our users in mind, making e-waste recycling accessible and rewarding.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Impact Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="text-4xl font-bold text-primary mb-2">24,850 kg</div>
              <p className="text-gray-600">E-waste properly recycled and diverted from landfills</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="text-4xl font-bold text-primary mb-2">15,000+</div>
              <p className="text-gray-600">Active users across India contributing to our mission</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="text-4xl font-bold text-primary mb-2">₹1.2M</div>
              <p className="text-gray-600">Value generated through our EcoCredits system</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <h3 className="font-semibold text-lg mb-4">Environmental Impact Equivalents</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-primary/20 rounded-xl p-4 bg-primary/5">
                <h4 className="font-medium mb-2">Carbon Reduction</h4>
                <p className="text-2xl font-bold text-primary mb-1">325 tons</p>
                <p className="text-sm text-gray-600">CO₂ emissions avoided</p>
              </div>
              
              <div className="border border-primary/20 rounded-xl p-4 bg-primary/5">
                <h4 className="font-medium mb-2">Trees Equivalent</h4>
                <p className="text-2xl font-bold text-primary mb-1">15,480</p>
                <p className="text-sm text-gray-600">Trees planted for one year</p>
              </div>
              
              <div className="border border-primary/20 rounded-xl p-4 bg-primary/5">
                <h4 className="font-medium mb-2">Energy Saved</h4>
                <p className="text-2xl font-bold text-primary mb-1">1.8M kWh</p>
                <p className="text-sm text-gray-600">Enough to power 164 homes for a year</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="bg-white py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center">Our Leadership Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-12">
              Meet the passionate individuals driving Green Byte's mission forward
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold text-lg">Sarah Johnson</h3>
                <p className="text-primary">Founder & CEO</p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold text-lg">Michael Chen</h3>
                <p className="text-primary">CTO</p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold text-lg">Priya Sharma</h3>
                <p className="text-primary">Head of Operations</p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold text-lg">David Kim</h3>
                <p className="text-primary">Chief Sustainability Officer</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Certifications */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold mb-4 text-center">Our Certifications</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-12">
            We adhere to the highest standards of e-waste management and sustainability
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">ISO 14001</h3>
                <p className="text-sm text-gray-600">Environmental Management</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">R2 Certified</h3>
                <p className="text-sm text-gray-600">Responsible Recycling</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">E-Waste License</h3>
                <p className="text-sm text-gray-600">Central Pollution Control Board</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Section */}
        <div className="bg-primary/10 py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center">Get in Touch</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-12">
              Have questions or want to learn more about Green Byte? We'd love to hear from you!
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                <p className="text-gray-600 mb-4">Our team is always ready to help with any questions</p>
                <Button variant="outline">info@greenbyte.com</Button>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                <p className="text-gray-600 mb-4">Mon-Fri, 9:00 AM - 6:00 PM IST</p>
                <Button variant="outline">+91 987-654-3210</Button>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
                <p className="text-gray-600 mb-4">Our headquarters in Bangalore</p>
                <Button variant="outline">View Map</Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
