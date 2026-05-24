import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getActiveHomeAnnouncement,
  deactivateHomeAnnouncement,
} from "../../../api/adminApi";
import { HomeAnnouncementDto } from "../../../api/types/adminAll.types";

const HomeAnnouncementsListPage = () => {
  const [announcement, setAnnouncement] =
    useState<HomeAnnouncementDto | null>(null);
  const navigate = useNavigate();

  const load = () => {
    getActiveHomeAnnouncement()
      .then(setAnnouncement)
      .catch(console.error);
  };

  useEffect(load, []);

  const remove = async (id: number) => {
    if (!window.confirm("Deactivate this announcement?")) return;
    await deactivateHomeAnnouncement(id);
    setAnnouncement(null);
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Home Announcements</h1>
        <button
          onClick={() =>
            navigate("/xkey/broadmin/home-announcements/create")
          }
          className="bg-yellow-500 px-4 py-2 rounded text-white"
        >
          Create new
        </button>
      </div>

      {announcement ? (
        <div className="border rounded p-4 space-y-2">
          <div
            onClick={() =>
              navigate(`/xkey/broadmin/home-announcements/${announcement.id}`)
            }
            className="cursor-pointer"
          >
            <h2 className="font-semibold text-lg">
              {announcement.title}
            </h2>
            <p className="text-sm text-gray-500">
              {new Date(announcement.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() =>
                navigate(
                  `/xkey/broadmin/home-announcements/${announcement.id}/edit`
                )
              }
              className="px-3 py-1 rounded bg-blue-500 text-white"
            >
              Edit
            </button>

            <button
              onClick={() => remove(announcement.id)}
              className="px-3 py-1 rounded bg-red-500 text-white"
            >
              Deactivate
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No active announcement</p>
      )}
    </div>
  );
};

export default HomeAnnouncementsListPage;
