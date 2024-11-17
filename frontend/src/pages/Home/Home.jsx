import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  BookOpen,
  BookMarked,
  Brain,
  Sparkles,
  GraduationCap,
  Clock,
  Shield,
  Upload,
  MessageSquare,
  Folder,
  ChevronRight,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "AI Study Assistant",
      description: "24/7 personalized learning support powered by advanced AI",
      icon: Brain,
      stats: [
        "500K+ Questions Answered",
        "98% Accuracy Rate",
        "< 2s Response Time",
      ],
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Smart Resource Hub",
      description:
        "Centralized platform for all your study materials and notes",
      icon: Folder,
      stats: ["50K+ Resources", "All Branches Covered", "Instant Access"],
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Interactive Learning",
      description:
        "Engage with materials through quizzes and practice sessions",
      icon: Sparkles,
      stats: ["1000+ Practice Sets", "Real-time Feedback", "Personalized Path"],
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  const services = [
    {
      title: "AI Chat Assistant",
      description:
        "Get instant answers to your academic queries with our advanced AI chat system",
      icon: MessageSquare,
      features: [
        "Natural Language Processing",
        "Context-Aware Responses",
        "Multi-language Support",
      ],
    },
    {
      title: "Resource Manager",
      description:
        "Organize and access your study materials efficiently with smart categorization",
      icon: Folder,
      features: ["Cloud Storage", "Advanced Search", "Version Control"],
    },
    {
      title: "Materials Browser",
      description:
        "Browse and download verified study materials from our extensive library",
      icon: Upload,
      features: [
        "Branch-wise Organization",
        "Peer Reviews",
        "Quality Verified",
      ],
    },
  ];

  const benefits = [
    {
      title: "Time-Saving",
      description:
        "Cut your study preparation time by 50% with AI-powered assistance",
      icon: Clock,
    },
    {
      title: "Personalized Learning",
      description: "Adaptive learning paths that evolve with your progress",
      icon: GraduationCap,
    },
    {
      title: "Verified Content",
      description:
        "All materials are verified by MITS faculty and top performers",
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
                  AI-Powered Learning
                </span>
                <h1 className="text-5xl md:text-6xl font-bold mt-4 leading-tight">
                  Future of
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Education
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mt-6">
                  Transform your academic journey with personalized AI
                  assistance, smart resource management, and interactive
                  learning tools.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:-translate-y-1"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate("/demo")}
                  className="group bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2"
                >
                  Watch Demo
                  <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -z-10 w-full h-full bg-gradient-to-r from-blue-100 to-purple-100 blur-3xl opacity-30 rounded-full"></div>
              <img
                src="/src/assets/gif.gif"
                alt="SEHPAATHI Demo"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            Core Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${
                  feature.gradient
                } p-8 rounded-2xl text-white transform transition-all duration-300 hover:-translate-y-2 ${
                  activeFeature === index ? "scale-105" : ""
                }`}
              >
                <feature.icon size={40} className="mb-6" />
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="mb-6 opacity-90">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.stats.map((stat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      {stat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <service.icon className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Sehpaathi?</h2>
            <p className="text-gray-600">
              Join thousands of MITS students who are already experiencing the
              future of learning
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group hover:bg-blue-50 p-8 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <benefit.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join the community of MITS students already achieving their academic
            goals with Sehpaathi
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
          >
            Get Started Now
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
