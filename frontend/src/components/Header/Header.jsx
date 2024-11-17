import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, User, UserPlus, Home, Menu, X } from "lucide-react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const headerItems = [
    {
      name: "Home",
      href: "",
      icon: Home,
    },
    {
      name: "About",
      href: "about",
      icon: BookOpen,
    },
    {
      name: "Sign In",
      href: "signin",
      icon: User,
    },
    {
      name: "Sign Up",
      href: "signup",
      icon: UserPlus,
    },
  ];

  const navigate = useNavigate();

  const handleNavigation = (href) => {
    navigate(`/${href}`);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex flex-row justify-between max-w-7xl mx-auto px-4 py-2 items-center">
        {/* Logo and Title */}
        <div
          className="flex flex-row items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="p-0">
            <img
              src="/src/assets/logo.png"
              alt="SEHPAATHI Logo"
              className="h-12 w-auto md:h-16"
            />
          </div>
          <div className="p-2 md:p-4">
            <span className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SEHPAATHI
            </span>
            <p className="text-xs md:text-sm text-gray-600">Your AI Study Companion</p>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-row items-center">
          {headerItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="flex items-center gap-2 p-2 px-4 m-2 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600 transition-all"
                onClick={() => handleNavigation(item.href)}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-gray-100">
          {headerItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="flex items-center gap-2 p-4 w-full hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all"
                onClick={() => handleNavigation(item.href)}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}

export default Header;