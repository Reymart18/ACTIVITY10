import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Role is fixed as attendee
      await axios.post("http://localhost:5000/auth/register", {
        name,
        email,
        password,
        role: "attendee",
      });
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen relative flex overflow-hidden">
      {/* Cover image background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url('/cover.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D132C]/90 via-[#5D1F3F]/85 to-[#801336]/90"></div>
      
      {/* Floating orbs for decoration */}
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 backdrop-blur-sm bg-black/10 border-b border-white/10">
        <div className="w-full px-8 lg:px-16 py-5 flex items-center">
          <h1 
            className="text-3xl font-bold tracking-wide cursor-pointer hover:text-pink-200 transition text-white"
            onClick={() => navigate("/")}
          >
            LiveScene
          </h1>
          <nav className="ml-auto flex items-center space-x-6">
            <a 
              onClick={() => navigate("/")}
              className="font-medium hover:text-pink-200 transition cursor-pointer text-white"
            >
              Home
            </a>
            <a 
              onClick={() => navigate("/login")}
              className="px-5 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-medium hover:bg-white/20 transition cursor-pointer text-white"
            >
              Login
            </a>
          </nav>
        </div>
      </header>

      {/* Left Side - Decorative Content */}
      <div className="hidden lg:flex relative z-30 w-[55%] items-center justify-center px-16">
        <div className="max-w-xl">
          {/* Cover image with unique styling */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-purple-600/30 rounded-3xl blur-2xl"></div>
            <div 
              className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:rotate-1 transition-transform duration-500 backdrop-blur-sm"
              style={{
                backgroundImage: `url('/cover.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '450px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D132C]/60 via-transparent to-transparent"></div>
            </div>
          </div>
          
          {/* Text content */}
          <div className="text-center">
            <h3 className="text-4xl font-bold text-white mb-4">Join LiveScene Today</h3>
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              Create your account and start exploring amazing events in your area
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">🎟️</div>
                <div className="text-white/80 text-xs">Easy Booking</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">📱</div>
                <div className="text-white/80 text-xs">Digital Tickets</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">🎉</div>
                <div className="text-white/80 text-xs">Great Events</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Container */}
      <div className="relative z-40 w-full lg:w-[45%] flex items-center justify-center lg:justify-start px-8 lg:px-16 pt-24 pb-12">
        <div className="w-full max-w-md">
          {/* Register Card with unique design */}
          <div className="relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-10 transform hover:scale-[1.02] transition-transform duration-300">
            {/* Decorative corner accent */}
            <div className="absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full blur-xl opacity-60"></div>
            
            <div className="relative">
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-white/60 text-sm">Sign up to get started with LiveScene</p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm">
                  <p className="text-red-300 text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="relative group">
                  <label className="block text-white/80 text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-4 rounded-xl border border-white/20 bg-white/5 placeholder-white/40 text-white outline-none focus:border-pink-400 focus:bg-white/10 transition-all group-hover:border-white/30"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-4 rounded-xl border border-white/20 bg-white/5 placeholder-white/40 text-white outline-none focus:border-pink-400 focus:bg-white/10 transition-all group-hover:border-white/30"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-4 rounded-xl border border-white/20 bg-white/5 placeholder-white/40 text-white outline-none focus:border-pink-400 focus:bg-white/10 transition-all group-hover:border-white/30"
                  />
                </div>

                <div className="relative">
                  <label className="block text-white/80 text-sm font-medium mb-2">Account Type</label>
                  <input
                    type="text"
                    value="Attendee"
                    disabled
                    className="w-full p-4 rounded-xl border border-white/10 bg-white/5 text-white/50 outline-none cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-pink-500/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-6"
                >
                  Create Account
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-white/60 text-sm">
                  Already have an account?{" "}
                  <span
                    className="text-pink-300 font-semibold cursor-pointer hover:text-pink-200 transition underline decoration-pink-300/30 hover:decoration-pink-200"
                    onClick={() => navigate("/login")}
                  >
                    Sign in here
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
