import React, { useState } from 'react';
import { useAuth } from '../hook/hookauth';
import { useNavigate, Link } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const { loading, handleSignup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
 
  const handleSignupsumit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await handleSignup(name, email, password);
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl  overflow-hidden ">
        {/* Left Side */}
        {/* <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 text-white relative overflow-hidden">
          <div className="absolute w-80 h-80 bg-white/10 rounded-full blur-3xl -top-24 -left-24"></div>
          <div className="absolute w-80 h-80 bg-black/20 rounded-full blur-3xl bottom-0 right-0"></div>

          <div className="relative z-10">
            <h1 className="text-5xl font-bold leading-tight">
              Create Account 🚀
            </h1>

            <p className="mt-6 text-lg text-white/80 max-w-md leading-relaxed">
              Join the platform and start exploring a modern experience with secure authentication and smooth access.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 mt-10">
            <p className="text-lg font-semibold">
              Trusted by thousands of users worldwide.
            </p>
            <p className="text-sm text-white/70 mt-2">
              Fast, responsive and beautifully designed authentication system.
            </p>
          </div>
        </div> */}

        {/* Right Side */}
        <div className="p-6 sm:p-10 lg:p-14 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-4xl font-bold text-white">
                Sign Up
              </h2>
              <p className="text-zinc-400 mt-3">
                Create your account to get started.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSignupsumit}>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none rounded-2xl px-4 py-3 text-white transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none rounded-2xl px-4 py-3 text-white transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none rounded-2xl px-4 py-3 text-white transition"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none rounded-2xl px-4 py-3 text-white transition"
                />
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 text-sm text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-cyan-500 mt-1"
                />
                <span>
                  I agree to the Terms & Conditions and Privacy Policy.
                </span>
              </label>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 active:scale-[0.98] transition-all duration-200 text-black font-bold py-3 rounded-2xl shadow-lg shadow-cyan-500/20"
              >
                Create Account
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>

              <div className="relative flex justify-center text-sm">
                <span className="bg-zinc-900 px-4 text-zinc-500">
                  Or sign up with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid ">
              <button className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white py-3 rounded-2xl transition font-medium">
                Google
              </button>

            </div>

            {/* Footer */}
            <p className="text-center text-zinc-500 mt-8 text-sm">
              Already have an account?{' '}
              <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition">
                <Link to="/login">Login</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
