import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInWithEmail,
  signInWithGoogle,
  clearError,
} from "../../features/user/userSlice.js";
import { Mail, Lock, Loader2, ArrowLeft } from "lucide-react";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    // Clear any existing errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Redirect to dashboard if authenticated
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    dispatch(
      signInWithEmail({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      })
    );
  };

  const handleGoogleSignIn = () => {
    dispatch(signInWithGoogle());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-50 rounded-full" />

        {/* Content Container */}
        <div className="relative">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 flex items-center justify-center">
                <img
                  src="frontend/public/assets/logo.png"
                  alt="Sehpaathi Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SEHPAATHI
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Sign in to your account
            </h2>
            <p className="text-gray-500">
              Welcome back! Please enter your details.
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

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                  placeholder="username@example.com"
                  required
                  disabled={loading}
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
                  onChange={handleChange}
                  className="w-full p-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  disabled={loading}
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
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
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full border border-gray-200 p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-600 font-medium">Google</span>
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <Link
              to="/signup"
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Don't have an account?{" "}
              <span className="text-blue-600 hover:text-blue-700">Sign up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
