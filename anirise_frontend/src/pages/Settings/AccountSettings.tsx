import React, { useEffect, useState } from "react";
import { getCurrentUser, updateProfile } from "../../api/userApi";
import { UpdateProfileRequest, UserDto } from "../../api/types/user.types";
import { useNavigate } from "react-router-dom";

const AccountSettings: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<UpdateProfileRequest>({
    username: "",
    birthDate: null,
    gender: null,
    visibility: "Public",
  });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user: UserDto = await getCurrentUser();

        setEmail(user.email);

        setForm({
          username: user.username,
          birthDate: user.birthDate ? user.birthDate.split("T")[0] : null,
          gender: user.gender === "Male" || user.gender === "Female" ? user.gender : null,
          visibility: user.visibility || "Public",
        });
      } catch (err) {
        console.error("Failed to load user data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedUser = await updateProfile(form);
      alert("Profile saved successfully!");
      if (updatedUser.username) {
        navigate(`/user/${updatedUser.username}`, { replace: true });
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Error while saving profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-20">
        Loading account settings…
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 text-white rounded-2xl shadow-xl p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Account Settings</h2>
        <p className="text-gray-400 mt-1">
          Manage your public profile information and preferences.
        </p>
      </div>

      {/* Profile section */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold border-b border-gray-700 pb-2">
          Profile Information
        </h3>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-sm text-gray-400 mt-1">
            This is your public name shown on your profile and posts.
          </p>
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            value={email}
            disabled
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-400 cursor-not-allowed"
          />
          <p className="text-sm text-gray-400 mt-1">
            Your email address is used for login and notifications.
          </p>
        </div>

        {/* Birth date */}
        <div>
          <label className="block text-sm font-medium mb-1">Birth date</label>
          <input
            type="date"
            name="birthDate"
            value={form.birthDate || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-sm text-gray-400 mt-1">
            Used for age-related content and statistics.
          </p>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={form.gender || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Not specified</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <p className="text-sm text-gray-400 mt-1">
            Optional. This information is shown on your public profile.
          </p>
        </div>
      </section>

      {/* Privacy section */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold border-b border-gray-700 pb-2">
          Privacy
        </h3>

        <div>
          <label className="block text-sm font-medium mb-1">
            Profile visibility
          </label>
          <select
            name="visibility"
            value={form.visibility}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-purple-500"
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
          <p className="text-sm text-gray-400 mt-1">
            Public profiles are visible to everyone. Private profiles are only
            visible to you.
          </p>
        </div>
      </section>

      {/* Save button */}
      <div className="pt-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-3 bg-purple-600 rounded-xl font-semibold hover:bg-purple-700 transition"
        >
          {loading ? "Saving changes..." : "Save changes"}
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;
