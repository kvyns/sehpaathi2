import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  School,
  UserCog,
  ArrowLeft,
  Mail,
  Lock,
  User,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { authService } from "../../auth/authService.js";

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowEmailForm(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authService.signUpWithEmail(
        formData.email,
        formData.password,
        selectedRole,
        formData.name
      );
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!selectedRole) {
      setError("Please select an account type first");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await authService.signInWithGoogle(selectedRole);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-50 rounded-full" />

        {/* Content Container */}
        <div className="relative">
          {/* Back Button */}
          <button
            onClick={() => {
              if (showEmailForm) {
                setShowEmailForm(false);
                setSelectedRole("");
              } else {
                navigate(-1);
              }
            }}
            className={`group flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-6 ${
              !showEmailForm ? "hidden" : "visible"
            }`}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10  flex items-center justify-center">
                <img
                  src="/src/assets/logo.png"
                  alt="Sehpaathi Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SEHPAATHI
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Create your account
            </h2>
            <p className="text-gray-500">
              {!showEmailForm
                ? "What type of account do you need?"
                : `Setting up your ${selectedRole} account`}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
              <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-bold text-xs">!</span>
              </div>
              {error}
            </div>
          )}

          {!showEmailForm ? (
            <>
              {/* Account Type Selection */}
              <div className="space-y-4 mb-6">
                <button
                  onClick={() => handleRoleSelect("student")}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group hover:border-blue-600 hover:bg-blue-50 ${
                    selectedRole === "student"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <School className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Student</p>
                      <p className="text-sm text-gray-500">
                        For learning and accessing resources
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 transition-colors ${
                      selectedRole === "student"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                <button
                  onClick={() => handleRoleSelect("instructor")}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group hover:border-blue-600 hover:bg-blue-50 ${
                    selectedRole === "instructor"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <UserCog className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Instructor</p>
                      <p className="text-sm text-gray-500">
                        For teaching and managing content
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 transition-colors ${
                      selectedRole === "instructor"
                        ? "text-purple-600"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                    placeholder="Enter Name"
                    required
                  />
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                    placeholder="username@example.com"
                    required
                  />
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignUp}
                type="button"
                disabled={isLoading}
                className="w-full border border-gray-200 p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-gray-600 font-medium">Google</span>
              </button>
            </form>
          )}

          {/* Login Link */}
          <div className="text-center mt-8">
            <Link
              to="/signin"
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Already have an account?{" "}
              <span className="text-blue-600 hover:text-blue-700">Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
