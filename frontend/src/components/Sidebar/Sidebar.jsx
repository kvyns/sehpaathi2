import React, { useState } from "react";
import { Bot, BookOpen, BookMarked, Gauge, LogOut } from "lucide-react";

const Sidebar = ({ selectedRole, handleSelectRole, handleLogOut }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        ${isHovered ? "w-64" : "w-20"}
        bg-white
        shadow-xl
        transition-all duration-300 ease-in-out
        overflow-hidden
        relative
        h-screen
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center p-3 border-b border-white/10 whitespace-nowrap">
        <img
          src="frontend/public/assets/logo.png"
          alt="Sehpaathi Logo"
          className="w-10 h-10 ml-2 object-contain flex-shrink-0 transition-transform duration-300"
        />
        <span
          className={`
           ml-3 font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
           transition-opacity duration-300
           ${isHovered ? "opacity-100" : "opacity-0"}
         `}
        >
          Sehpaathi
        </span>
      </div>

      <nav className="p-4">
        <div className="space-y-3">
          {[
            { id: "dashboard", icon: Gauge, label: "Dashboard" },
            { id: "sehpaathi", icon: Bot, label: "Sehpaathi Alive" },
            { id: "materials", icon: BookOpen, label: "Study Materials" },
            { id: "resources", icon: BookMarked, label: "Your Resources" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => handleSelectRole(id)}
              className={`
                flex items-center w-full p-3 rounded-lg whitespace-nowrap
                transition-all duration-300 ease-in-out
                group
                ${
                  selectedRole === id
                    ? "bg-gradient-to-br from-blue-100 to-purple-100 text-black"
                    : "text-black/80 hover:bg-white/10"
                }
              `}
            >
              <div className="flex items-center">
                <Icon
                  size={20}
                  className={`
                    flex-shrink-0
                    transition-transform duration-300
                    ${
                      selectedRole === id
                        ? "scale-110"
                        : "group-hover:scale-105"
                    }
                  `}
                />
                <span
                  className={`
                    ml-3
                    transition-opacity duration-300 ease-in-out
                    ${isHovered ? "opacity-100" : "opacity-0"}
                  `}
                >
                  {label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
        <button
          className={`
            flex items-center w-full p-3 rounded-lg whitespace-nowrap
            text-red/80
            hover:bg-red-500 hover:text-white
            transition-all duration-300 ease-in-out
            group
          `}
          onClick={handleLogOut}
        >
          <LogOut
            size={20}
            className="flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
          />
          <span
            className={`
              ml-3
              transition-opacity duration-300 ease-in-out
              ${isHovered ? "opacity-100" : "opacity-0"}
            `}
          >
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
