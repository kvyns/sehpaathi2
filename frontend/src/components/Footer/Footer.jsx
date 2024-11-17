import React from "react";
import {
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  BookOpen,
  Shield,
  HelpCircle,
} from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about", icon: BookOpen },
        { name: "Our Team", href: "/team", icon: ExternalLink },
        { name: "Contact", href: "/contact", icon: Mail },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Study Materials", href: "/materials", icon: BookOpen },
        { name: "Help Center", href: "/help", icon: HelpCircle },
        { name: "Privacy Policy", href: "/privacy", icon: Shield },
      ],
    },
    {
      title: "Contact Us",
      content: [
        { text: "contact@sehpaathi.com", icon: Mail },
        { text: "MITS, Gwalior, MP", icon: MapPin },
        { text: "+91 123-456-7890", icon: Phone },
      ],
    },
  ];

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
    { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:text-blue-600" },
    { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-500" },
    { name: "Instagram", icon: Instagram, href: "#", color: "hover:text-pink-500" },
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        {/* Top section with logo and newsletter */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Logo and description */}
          <div className="space-y-6">
            <div className="flex items-center">
              <img
                src="/src/assets/logo.png"
                alt="SEHPAATHI Logo"
                className="h-12 w-auto mr-4"
              />
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SEHPAATHI
                </div>
                <p className="text-sm text-gray-600">Your AI Study Companion</p>
              </div>
            </div>
            <p className="text-gray-600 max-w-md text-sm leading-relaxed">
              Empowering MITS students with AI-powered learning assistance,
              personalized study resources, and 24/7 academic support.
            </p>
            {/* Social Links */}
            <div className="flex space-x-5">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className={`text-gray-500 transition-colors duration-200 ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon size={20} strokeWidth={1.5} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:pl-8 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Stay Updated</h3>
            <p className="text-gray-600 text-sm">
              Subscribe to our newsletter for the latest updates and study resources.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button 
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Main footer sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 py-8 border-t border-gray-200">
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
              <ul className="space-y-3">
                {section.links
                  ? section.links.map((link, linkIndex) => {
                      const Icon = link.icon;
                      return (
                        <li key={linkIndex}>
                          <a
                            href={link.href}
                            className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 text-sm"
                          >
                            <Icon size={16} strokeWidth={1.5} />
                            <span>{link.name}</span>
                          </a>
                        </li>
                      );
                    })
                  : section.content.map((item, contentIndex) => {
                      const Icon = item.icon;
                      return (
                        <li
                          key={contentIndex}
                          className="flex items-center gap-2 text-gray-600 text-sm"
                        >
                          <Icon size={16} strokeWidth={1.5} />
                          <span>{item.text}</span>
                        </li>
                      );
                    })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {currentYear} SEHPAATHI. All rights reserved.
            </p>
            <nav className="flex flex-wrap justify-center gap-6 text-sm">
              <a
                href="/terms"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="/privacy"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="/cookies"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;