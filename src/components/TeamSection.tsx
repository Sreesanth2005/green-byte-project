
import { Github, Linkedin, Twitter } from "lucide-react";

const TeamSection = () => {
  const team = [
    {
      name: "Bhuvanadharan G",
      role: "Team Leader",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      description: "A visionary leader with expertise in project management and system architecture. Bhuvanadharan coordinates all aspects of the project and ensures Green Byte achieves its sustainability goals.",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "D.V. Sreesanth",
      role: "Front End Designer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      description: "Creative UI/UX specialist who crafts the intuitive and engaging user experiences that make Green Byte accessible to everyone. Sreesanth is passionate about designing for sustainability.",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "Kavin S",
      role: "Database Manager",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      description: "Database expert responsible for efficient data management and ensuring the scalability of Green Byte's growing eco-conscious community. Kavin optimizes performance across all data systems.",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "Niteesh Kumar Reddy",
      role: "Backend Manager",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      description: "Backend development specialist who builds the robust systems that power Green Byte's recycling operations. Niteesh ensures seamless integration of all platform features.",
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
            Our dedicated team of MTech Integrated students from VIT-AP University is committed to making e-waste recycling accessible and rewarding for everyone.
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
              <p className="text-sm text-gray-500 mt-2">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
