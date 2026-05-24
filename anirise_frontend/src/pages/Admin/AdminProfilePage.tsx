import { useEffect, useState } from "react";
import { AdminProfileDto } from "../../api/types/adminAll.types";
import { getAdminProfile } from "../../api/adminApi";

const AdminProfilePage = () => {
  const [admin, setAdmin] = useState<AdminProfileDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminProfile()
      .then(setAdmin)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading admin profile...</p>;
  }

  if (!admin) {
    return <p className="text-red-500">Failed to load admin profile</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin profile</h1>

      {/* Header */}
      <div className="flex gap-6 items-center mb-10">
        <img
          src={admin.avatarUrl || "/avatar-placeholder.png"}
          alt="Admin avatar"
          className="w-28 h-28 rounded-full object-cover border"
        />

        <div>
          <h2 className="text-2xl font-semibold">{admin.username}</h2>
          <p className="text-gray-600">{admin.email}</p>
          <p className="mt-1 text-sm">
            Role: <span className="font-medium">{admin.role}</span>
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <ProfileItem label="User ID" value={admin.id} />
        <ProfileItem
          label="Created at"
          value={new Date(admin.createdAt).toLocaleString()}
        />
        <ProfileItem
          label="Birth date"
          value={admin.birthDate
            ? new Date(admin.birthDate).toLocaleDateString()
            : "—"}
        />
        <ProfileItem label="Gender" value={admin.gender ?? "—"} />
        <ProfileItem label="Visibility" value={admin.visibility} />
        <ProfileItem label="Theme preference" value={admin.themePreference} />
      </div>
    </div>
  );
};

const ProfileItem = ({ label, value }: { label: string; value: string }) => (
  <div className="border rounded-lg p-4 bg-white">
    <p className="text-gray-500 mb-1">{label}</p>
    <p className="font-medium break-all">{value}</p>
  </div>
);

export default AdminProfilePage;
