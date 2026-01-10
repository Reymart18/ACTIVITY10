import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("attendee"); // default role
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:5000/auth/register", { name, email, password, role });
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#2A2529] to-[#F3F0E7]">
      <div className="relative bg-white/20 backdrop-blur-xl border border-[#262424]/50 rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Register</h2>

        {error && <p className="text-red-500 bg-red-100/30 p-2 rounded-md mb-4 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="p-3 rounded-lg border border-gray-300/50 bg-white/30 placeholder-gray-200 text-white outline-none focus:ring-2 focus:ring-purple-400 transition"
          />
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

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-3 rounded-lg border border-gray-300/50 bg-white/30 text-white outline-none focus:ring-2 focus:ring-purple-400 transition"
          >
            <option value="attendee">Attendee</option>
            <option value="organizer">Organizer</option>
          </select>

          <button
            type="submit"
            className="bg-[#2A2529] text-white font-semibold py-3 rounded-lg hover:bg-[#262E36] transition-colors shadow-md"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-200">
          Already have an account?{" "}
          <span
            className="text-white font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-500 to-pink-400 opacity-20 blur-3xl -z-10"></div>
    </div>
  );
}
