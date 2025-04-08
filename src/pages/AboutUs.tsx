
import React from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { User, Code, Database, PenTool, Users } from "lucide-react";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Bhuvanadharan G",
      role: "Team Leader",
      description: "Bhuvanadharan leads the Green Byte initiative, coordinating all aspects of the project and ensuring its successful implementation. As an MTech Integrated student from VIT-AP University, he brings strong leadership and technical skills to guide the team.",
      icon: <Users className="h-12 w-12 text-primary" />
    },
    {
      name: "D.V. Sreesanth",
      role: "Front End Designer",
      description: "Sreesanth is responsible for designing and implementing the user interface of Green Byte. An MTech Integrated student from VIT-AP University, he specializes in creating engaging, responsive, and user-friendly interfaces with modern front-end technologies.",
      icon: <PenTool className="h-12 w-12 text-primary" />
    },
    {
      name: "Kavin S",
      role: "Database Manager",
      description: "Kavin manages the data architecture and database operations for Green Byte. As an MTech Integrated student from VIT-AP University, he ensures efficient data storage, retrieval, and security while optimizing database performance.",
      icon: <Database className="h-12 w-12 text-primary" />
    },
    {
      name: "Niteesh Kumar Reddy",
      role: "Backend Manager",
      description: "Niteesh oversees the backend development of Green Byte, implementing server-side logic and APIs. An MTech Integrated student from VIT-AP University, he specializes in creating robust, scalable backend systems that power the application's functionality.",
      icon: <Code className="h-12 w-12 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">About Green Byte</h1>
            <p className="text-white/90 max-w-3xl mx-auto">
              We're on a mission to revolutionize electronic waste management through
              innovative technology and community engagement.
            </p>
          </div>
        </div>
        
        {/* Our Vision */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-gray-600">
              Green Byte aims to tackle the global e-waste crisis by connecting consumers with certified 
              recycling services, while incentivizing responsible disposal through an innovative eco-credit system.
              Our platform transforms electronic waste management into a rewarding experience that benefits both 
              individuals and our planet.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-gray-600">
                Promoting environmentally responsible practices by extending the lifecycle of electronic devices through refurbishment and proper recycling.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Economy</h3>
              <p className="text-gray-600">
                Creating a circular economy where electronic waste is transformed into value through our eco-credit system and marketplace for refurbished devices.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                Building a community of environmentally conscious individuals and organizations committed to reducing e-waste and its environmental impact.
              </p>
            </div>
          </div>
        </div>
        
        {/* Our Team */}
        <div className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
              <p className="max-w-3xl mx-auto text-gray-600">
                Our talented team of MTech Integrated students from VIT-AP University is committed to making 
                a positive environmental impact through innovative technology solutions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {member.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Our Mission */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <div className="w-20 h-1 bg-primary mb-6"></div>
              <p className="text-gray-600 mb-6">
                Green Byte's mission is to create a sustainable and environmentally friendly solution to the growing problem of electronic waste. 
                We aim to reduce the environmental impact of e-waste by:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Facilitating proper disposal and recycling of electronic devices</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Creating a marketplace for refurbished electronics</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Incentivizing sustainable practices through our eco-credit system</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Educating the community about the importance of responsible e-waste management</span>
                </li>
              </ul>
            </div>
            <div className="bg-primary/10 p-8 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">Impact by Numbers</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-primary">5000+</div>
                  <div className="text-gray-600 mt-2">Devices Recycled</div>
                </div>
                <div className="bg-white p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-primary">2500+</div>
                  <div className="text-gray-600 mt-2">Users</div>
                </div>
                <div className="bg-white p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-primary">20+</div>
                  <div className="text-gray-600 mt-2">Collection Events</div>
                </div>
                <div className="bg-white p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-primary">15000+</div>
                  <div className="text-gray-600 mt-2">Kg CO2 Saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Get Involved */}
        <div className="bg-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Get Involved</h2>
            <p className="max-w-3xl mx-auto mb-8">
              Join us in our mission to reduce electronic waste and build a more sustainable future. 
              There are many ways you can contribute to our cause.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/signup" className="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Create an Account
              </a>
              <a href="/schedule-pickup" className="bg-primary-dark border border-white px-6 py-3 rounded-lg font-medium hover:bg-primary-darker transition-colors">
                Schedule a Pickup
              </a>
              <a href="/events" className="bg-primary-dark border border-white px-6 py-3 rounded-lg font-medium hover:bg-primary-darker transition-colors">
                Attend an Event
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
