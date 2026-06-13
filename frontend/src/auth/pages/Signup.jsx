import React, { useState } from "react";
import { useAuth } from "../hook/hookauth";
import { useNavigate, Link } from "react-router-dom";
import AppSkeleton from '../components/AppSkeleton.jsx';
import { getFcmToken } from "../services/getFcmToken.js";


export default function SignupPage() {
  const navigate = useNavigate();
  const { loading, handleSignup ,loginWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");


  const handleGoogleLogin = async () => {
    try {
       const fcmToken = await getFcmToken();
      const data = await loginWithGoogle(fcmToken);

      console.log(data);

      // setUser(data.user)
      // navigate("/chat")
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Only PNG and JPG files are allowed");
      return;
    }

    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSignupsumit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
      const fcmToken = await getFcmToken();
    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("fcmToken",fcmToken)

    if (avatar) {
      formData.append("avatar", avatar);
    }

    const result = await handleSignup(formData);

    if (result !== false) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl overflow-hidden">
        <div className="p-6 sm:p-10 lg:p-14 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-4xl font-bold text-white">Sign Up</h2>
              <p className="text-zinc-400 mt-3">
                Create your account to get started.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSignupsumit}>
              {/* Avatar Upload */}
              <div className="flex flex-col items-center mb-6">
                <label
                  htmlFor="avatar"
                  className="cursor-pointer group"
                >
                  <div className="relative">
                    <img
                      src={
                        preview ||
                        "https://ui-avatars.com/api/?name=User&background=27272a&color=fff"
                      }

                      alt="Avatar"
                      className="w-32 h-32 rounded-full object-cover border-4 border-zinc-700 group-hover:border-cyan-500 transition"
                    />

                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <span className="text-white text-sm font-semibold">
                        Change
                      </span>
                    </div>
                  </div>
                </label>

                <input
                  id="avatar"
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <p className="text-zinc-500 text-sm mt-3">
                  Upload PNG or JPG image
                </p>
              </div>

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
                  required
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
                  required
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
                  required
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
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none rounded-2xl px-4 py-3 text-white transition"
                />
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 text-sm text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="accent-cyan-500 mt-1"
                />
                <span>
                  I agree to the Terms & Conditions and Privacy Policy.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 active:scale-[0.98] transition-all duration-200 text-black font-bold py-3 rounded-2xl shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>

              <div className="relative flex justify-center text-sm">
                <span className="bg-black px-4 text-zinc-500">
                  Or sign up with
                </span>
              </div>
            </div>

            {/* Google */}
            <div className="grid">
              <button
                type="button" onClick={handleGoogleLogin} 
                className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white py-3 rounded-2xl transition font-medium"
              >
                Google
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-zinc-500 mt-8 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-cyan-400 hover:text-cyan-300 transition"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}