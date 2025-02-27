
import { Github, Linkedin, Twitter } from "lucide-react";

const TeamSection = () => {
  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "Michael Chen",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "Emily Rodriguez",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "David Kim",
      role: "Sustainability Expert",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
      },
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our dedicated team of experts is committed to making e-waste recycling accessible and rewarding for everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div key={member.name} className="text-center group">
              <div className="relative mb-4 inline-block">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-48 h-48 rounded-full mx-auto object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                  <a href={member.social.twitter} className="text-white hover:text-primary">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href={member.social.linkedin} className="text-white hover:text-primary">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href={member.social.github} className="text-white hover:text-primary">
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
