import React, { useState } from 'react';
import { useAuth } from '../hook/hookauth';
import { useNavigate, Link } from "react-router-dom";
import AppSkeleton from '../components/AppSkeleton.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loading, handleLogin,loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const data = await loginWithGoogle();

      console.log(data);

      // setUser(data.user)
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  };

  
  const handleLoginsumit = async (e) => {
      e.preventDefault();

  try {
    setError("");

    await handleLogin(email, password);

    // navigate to chat page
    navigate("/");
  } catch (err) {
  console.log("LOGIN PAGE ERROR:", err);

  if (err.status === 429) {
    navigate("/rate-limit");
    return;
  }

  setError(err.message);
}
   
  }
  
  if (loading) {
    return (
      <div className="h-full  bg-zinc-950 p-2">
        <AppSkeleton />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center ">
      <div className="w-full max-w-6xl  overflow-hidden shadow-2xl ">
        {/* Left Side */}
        {/* <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-24 -translate-y-24"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-black/20 rounded-full blur-3xl translate-x-20 translate-y-20"></div>

          <div className="relative z-10">
            <h1 className="text-5xl font-bold leading-tight">
              Welcome Back 👋
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-md leading-relaxed">
              Sign in to continue your journey. Manage your account, explore new features, and stay connected.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 mt-10">
            <img
              src="https://i.pravatar.cc/100"
              alt="User"
              className="w-14 h-14 rounded-full border-2 border-white"
            />
            <div>
              <p className="font-semibold text-lg">Trusted by creators</p>
              <p className="text-white/70 text-sm">
                Modern authentication experience.
              </p>
            </div>
          </div>
        </div> */}

        {/* Right Side */}
        <div className="p-6 sm:p-10 lg:p-14 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-4xl font-bold text-white">Login</h2>
              <p className="text-zinc-400 mt-3">
                Enter your details to access your account.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleLoginsumit}>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none rounded-2xl px-4 py-3 text-white transition"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition"
                  >
                    Forgot password?
                  </button>
                </div>

                <input
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none rounded-2xl px-4 py-3 text-white transition"
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-indigo-500 w-4 h-4"
                  />
                  Remember me
                </label>
              </div>

              {/* Button */}
              <button
              onClick={handleLoginsumit}

                className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all duration-200 text-white font-semibold py-3 rounded-2xl shadow-lg shadow-indigo-600/30"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-zinc-900 px-4 text-zinc-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid ">
              <button onClick={handleGoogleLogin} className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white py-3 rounded-2xl transition font-medium">
                Google
              </button>

            
            </div>
              {error && (
    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-3">
      {error}
    </div>
  )}

            {/* Footer */}
            <p className="text-center text-zinc-500 mt-8 text-sm">
              Don’t have an account?{' '}
              <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer transition">
               <Link to="/signup">Sign up</Link>
               
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
