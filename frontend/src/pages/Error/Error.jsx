import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ChevronRight } from "lucide-react";

const Error= () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white text-center px-4">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-12 rounded-3xl shadow-lg text-white flex flex-col items-center">
        <AlertTriangle size={120} className="mb-6 text-yellow-400" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Oops! Something Went Wrong
        </h1>
        <p className="text-lg text-white/90 mb-8">
          The page you’re looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2"
          >
            Go Back Home
            <ChevronRight className="text-blue-600 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="group bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2"
          >
            Contact Support
            <ChevronRight className="text-blue-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      <p className="mt-8 text-gray-600 text-sm">
        If the problem persists, please reach out to us for assistance.
      </p>
    </div>
  );
};

export default Error;
