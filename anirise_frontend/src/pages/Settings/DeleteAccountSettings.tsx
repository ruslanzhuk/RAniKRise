import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { deleteAccount } from "../../api/userApi";

const DeleteAccountSettings: React.FC = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!password) {
      setError("Please enter your password to confirm.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await deleteAccount(password);
      logout();
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md bg-white dark:bg-neutral-900">
      <h2 className="text-xl font-semibold mb-4 text-red-600">Delete Account</h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        Enter your password to permanently delete your account. This action cannot be undone.
      </p>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Your password"
        className="w-full p-2 border rounded mb-2 dark:bg-neutral-800 dark:text-white"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded"
      >
        {loading ? "Deleting..." : "Delete Account"}
      </button>
    </div>
  );
};

export default DeleteAccountSettings;
