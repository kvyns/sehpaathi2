import React from 'react';
import { Bot, BookOpen, BookMarked } from 'lucide-react';

const QuickAccess = ({ handleSelectRole }) => {
  const cards = [
    {
      id: "sehpaathi",
      icon: Bot,
      title: "Sehpaathi Alive",
      description:
        "Get instant help with homework, assignments, and exam preparation",
      gradient: "from-blue-500 to-blue-600",
      buttonClasses: "bg-white text-blue-600 hover:bg-blue-100",
      buttonText: "Start Conversation",
    },
    {
      id: "materials",
      icon: BookOpen,
      title: "Study Materials",
      description: "Access course materials, notes, and previous year papers",
      gradient: "from-purple-500 to-purple-600",
      buttonClasses: "bg-white text-purple-600 hover:bg-purple-100",
      buttonText: "Browse Materials",
    },
    {
      id: "resources",
      icon: BookMarked,
      title: "Your Resources",
      description:
        "Organise your bookmarks, notes, tools, blocks, projects, media",
      gradient: "from-pink-500 to-pink-600",
      buttonClasses: "bg-white text-pink-600 hover:bg-pink-100",
      buttonText: "Manage Resources",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {cards.map(
        ({
          id,
          icon: Icon,
          title,
          description,
          gradient,
          buttonClasses,
          buttonText,
        }) => (
          <div
            key={id}
            className={`bg-gradient-to-r ${gradient} rounded-xl p-6 text-white`}
          >
            <Icon size={32} />
            <h3 className="text-xl font-bold mt-4">{title}</h3>
            <p className="mt-2 opacity-90">{description}</p>
            <button
              onClick={() => handleSelectRole(id)}
              className={`mt-4 px-4 py-2 rounded-lg font-medium transition-colors ${buttonClasses}`}
            >
              {buttonText}
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default QuickAccess;
