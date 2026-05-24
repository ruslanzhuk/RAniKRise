import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "../../api/userApi";
import toast from "react-hot-toast";
import { getPasswordStrength } from "./passwordStrength";

const ResetPassword: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return <p className="text-red-500 text-center mt-20">Invalid token</p>;
  }

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(token, password);
      toast.success("Password changed successfully");
      setTimeout(() => navigate("/login"), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h2 className="text-white text-xl font-bold mb-4 text-center">
          Reset password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 px-4 py-2 rounded text-white"
          />

          <div className="text-sm text-gray-400">
            Strength:{" "}
            <span
              className={
                strength === "Strong"
                  ? "text-green-400"
                  : strength === "Medium"
                  ? "text-yellow-400"
                  : "text-red-400"
              }
            >
              {strength}
            </span>
          </div>

          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full bg-gray-800 px-4 py-2 rounded text-white"
          />

          <button
            disabled={loading}
            className="w-full bg-purple-600 py-2 rounded text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
