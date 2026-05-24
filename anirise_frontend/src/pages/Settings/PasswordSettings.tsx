import React, { useState } from "react";
import { requestPasswordReset, confirmPasswordReset } from "../../api/userApi";

type Status = { type: "success" | "error"; message: string } | null;

const PasswordSettings: React.FC = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const handleRequest = async () => {
    setLoading(true);
    setStatus(null);
    try {
      await requestPasswordReset(email);
      setStatus({ type: "success", message: "Password reset email has been sent." });
      setStep("confirm");
    } catch (err: any) {
      setStatus({ type: "error", message: err.response?.data?.message || "Failed to send password reset email." });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    setStatus(null);
    try {
      await confirmPasswordReset(token, newPassword);
      setStatus({ type: "success", message: "Password successfully updated!" });
      setStep("request");
      setEmail("");
      setToken("");
      setNewPassword("");
    } catch (err: any) {
      setStatus({ type: "error", message: err.response?.data?.message || "Failed to confirm password reset." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 text-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">Password Settings</h2>

      {/* Step indicator */}
      <div className="flex items-center mb-4 space-x-2 text-sm">
        <span className={`font-semibold ${step === "request" ? "text-purple-400" : "text-gray-400"}`}>1. Request</span>
        <span className="text-gray-500">→</span>
        <span className={`font-semibold ${step === "confirm" ? "text-purple-400" : "text-gray-400"}`}>2. Confirm</span>
      </div>

      {/* Status message */}
      {status && (
        <div className={`p-2 rounded ${status.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {status.message}
        </div>
      )}

      {/* Request step */}
      {step === "request" && (
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Account Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-sm text-gray-400 mt-1">
              We will send a password reset code to this email.
            </p>
          </div>
          <button
            onClick={handleRequest}
            disabled={loading || !email.trim()}
            className="w-full py-2 px-4 bg-purple-600 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send reset email"}
          </button>
        </div>
      )}

      {/* Confirm step */}
      {step === "confirm" && (
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Reset Token</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter token from email"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-sm text-gray-400 mt-1">
              Enter the token sent to your email to reset your password.
            </p>
          </div>

          <div>
            <label className="block text-gray-400 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Create new password"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-sm text-gray-400 mt-1">
              Make sure your password is at least 8 characters long and secure.
            </p>
          </div>

          <button
            onClick={handleConfirm}
            disabled={loading || !token.trim() || !newPassword.trim()}
            className="w-full py-2 px-4 bg-purple-600 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Confirming..." : "Confirm password change"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PasswordSettings;
