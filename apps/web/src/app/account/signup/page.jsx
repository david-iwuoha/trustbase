import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, X, Eye, EyeOff, Mail, Lock } from "lucide-react";
import useAuth from "../../../utils/useAuth";


export default function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nin, setNin] = useState("");
  const [ninVerifying, setNinVerifying] = useState(false);

  const { signUpWithCredentials } = useAuth();

  const validateNIN = (ninValue) => {
    return /^\d{11}$/.test(ninValue);
  };

  const simulateNINVerification = () => {
    setNinVerifying(true);
    setTimeout(() => {
      setNinVerifying(false);
    }, 2000);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (nin && !validateNIN(nin)) {
      setError("NIN must be exactly 11 digits");
      setLoading(false);
      return;
    }

    try {
      if (nin) {
        simulateNINVerification();
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      await signUpWithCredentials({
        email,
        password,
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        OAuthSignin: "Couldn't start sign-up. Please try again.",
        OAuthCallback: "Sign-up failed. Please try again.",
        OAuthCreateAccount: "Couldn't create account. Try another method.",
        EmailCreateAccount: "This email may already be registered.",
        Callback: "Something went wrong. Please try again.",
        OAuthAccountNotLinked: "Try using a different sign-up method.",
        CredentialsSignin: "Registration failed. Please try again.",
        AccessDenied: "You don't have permission to sign up.",
        Configuration: "Sign-up unavailable right now.",
        Verification: "Your link has expired. Request a new one.",
      };

      setError(
        errorMessages[err.message] || "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Left side - Collaboration Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10"></div>
        <img
          src="https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=800&h=800"
          alt="Nigerian team working together on digital solutions"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Start Your Privacy Journey
              </h2>
              <p className="text-lg text-white/90">
                Take control of your data with Nigeria's first transparency
                platform
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Close button */}
        <motion.a
          href="/"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-6 right-6 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200"
        >
          <X className="w-5 h-5 text-gray-600" />
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">TrustBase</span>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600">
              Join thousands of Nigerians protecting their data privacy
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* NIN Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                National Identification Number (NIN) - Optional
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 11) {
                      setNin(value);
                    }
                  }}
                  placeholder="Enter your 11-digit NIN (demo)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  maxLength="11"
                />
                {ninVerifying && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {nin && !validateNIN(nin) && nin.length > 0 && (
                <p className="text-sm text-red-500">
                  NIN must be exactly 11 digits
                </p>
              )}
              {nin && validateNIN(nin) && (
                <p className="text-sm text-green-500">✓ Valid NIN format</p>
              )}
              <p className="text-xs text-gray-500">
                Your NIN helps us verify your identity for enhanced security
                (demo only)
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading || ninVerifying}
              whileHover={{ scale: loading || ninVerifying ? 1 : 1.02 }}
              whileTap={{ scale: loading || ninVerifying ? 1 : 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading || ninVerifying ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>
                    {ninVerifying ? "Verifying NIN..." : "Creating Account..."}
                  </span>
                </div>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          {/* Switch to Sign In */}
          <div className="mt-8 text-center">
            <a
              href="/account/signin"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Already have an account? Sign in
            </a>
          </div>

          {/* Terms and Privacy */}
          <div className="mt-6 text-center text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lock className="w-4 h-4" />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>NDPR Compliant</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}



