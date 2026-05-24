import React, { useState } from "react";
import { requestPasswordReset } from "../../api/userApi";
import toast from "react-hot-toast";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await requestPasswordReset(email);
      toast.success(
        "If an account with this email exists, a reset link has been sent."
      );
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">
          Forgot password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
          />

          <button
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg text-white disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
