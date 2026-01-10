import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      const { user, token } = res.data;

      // Save token in localStorage
      localStorage.setItem("token", token);

      // Role-based redirect
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "organizer") navigate("/organizer");
      else if (user.role === "attendee") navigate("/attendee");
      else navigate("/"); // fallback
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#249E94] to-[#161E54]">
      <div className="relative bg-white/20 backdrop-blur-xl border border-[#262424]/50 rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Login</h2>

        {error && (
          <p className="text-red-500 bg-red-100/30 p-2 rounded-md mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 rounded-lg border border-gray-300/50 bg-white/30 placeholder-gray-200 text-white outline-none focus:ring-2 focus:ring-purple-400 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 rounded-lg border border-gray-300/50 bg-white/30 placeholder-gray-200 text-white outline-none focus:ring-2 focus:ring-purple-400 transition"
          />

          <button
            type="submit"
            className="bg-[#2A2529] text-white font-semibold py-3 rounded-lg hover:bg-[#262E36] transition-colors shadow-md"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-200">
          Don’t have an account?{" "}
          <span
            className="text-white font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-500 to-pink-400 opacity-20 blur-3xl -z-10"></div>
    </div>
  );
}
