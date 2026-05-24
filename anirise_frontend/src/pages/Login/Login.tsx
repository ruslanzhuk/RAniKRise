import React, { useState, useContext, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      console.log("Redirecting to home after successful login");
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/User/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      const data = await response.json();
      console.log("Backend response:", data);
      if (!response.ok) {
        throw new Error("Invalid credentials: " + JSON.stringify(data));
      }

      console.log("Token to decode:", data.token);
      login(data.token);
      console.log("Login called");
      setIsLoggedIn(true);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Login to RAniKRise
        </h2>

        {error && (
          <div className="bg-red-600 text-white text-sm p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition"
          >
            Login
          </button>
        </form>

        <div className="text-gray-400 text-sm text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-purple-400 hover:underline">
            Register
          </a>
        </div>

        <div className="text-gray-400 text-sm text-center mt-2">
          <a href="/forgot-password" className="text-purple-400 hover:underline">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
