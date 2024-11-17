import React from "react";
import { BookOpen, Code, Palette, Mail, MapPin, School } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Kavity",
      role: "Backend Developer",
      college: "NIT Bhopal",
      image: "/src/assets/kavity.jpg",
      expertise: ["Python", "AI/ML", "System Architecture"],
      social: {
        github: "github.com/kavity",
        linkedin: "linkedin.com/in/kavity",
      },
    },
    {
      name: "Raunnieo",
      role: "Frontend Developer",
      college: "MITS Gwalior",
      image: "/src/assets/raunnieo.jpg",
      expertise: ["React", "UI/UX", "Full-Stack"],
      social: {
        github: "github.com/raunnieo",
        linkedin: "linkedin.com/in/raunnieo",
      },
    },
    {
      name: "Arya",
      role: "UI/UX Designer",
      college: "MITS Gwalior",
      image: "/src/assets/arya.jpg",
      expertise: ["Design Systems", "User Research", "Prototyping"],
      social: {
        github: "github.com/aryadesign",
        linkedin: "linkedin.com/in/aryadesign",
      },
    },
  ];

  const journeySteps = [
    {
      title: "The Problem",
      description:
        "As students ourselves, we experienced firsthand the chaos of managing scattered study resources, tracking assignments, and trying to make sense of complex concepts without 24/7 support.",
      icon: BookOpen,
    },
    {
      title: "The Vision",
      description:
        "We believed that engineering solutions should go beyond quick fixes. We envisioned a central hub that would revolutionize how students learn and collaborate.",
      icon: Code,
    },
    {
      title: "The Solution",
      description:
        "Sehpaathi was born - an AI-powered platform that brings together resource management, personalized learning, and round-the-clock assistance in one seamless experience.",
      icon: Palette,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
            Our Story
          </span>
          <h1 className="text-4xl font-bold mt-6 mb-6">
            From Student Struggles to
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Innovation
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Sehpaathi emerged from the daily challenges faced by students and
            developers, transforming the way we approach learning and resource
            management in engineering education.
          </p>
        </div>

        {/* Journey Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {journeySteps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <step.icon className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold mb-4">{step.title}</h2>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet the Innovators
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all group"
              >
                <div className="relative mb-6">
                  <img
                    src="/assets/logo.png"
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-100 px-3 py-1 rounded-full">
                    <p className="text-sm text-blue-600 font-medium">
                      {member.role}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                    <School size={16} />
                    <p className="text-sm">{member.college}</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.expertise.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-12 rounded-2xl text-white text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
          <p className="text-xl mb-8 opacity-90">
            Have ideas, feedback, or want to contribute? We'd love to hear from
            you!
          </p>
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <Mail size={20} />
              <p>contact@sehpaathi.com</p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} />
              <p>MITS, Gwalior, Madhya Pradesh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
