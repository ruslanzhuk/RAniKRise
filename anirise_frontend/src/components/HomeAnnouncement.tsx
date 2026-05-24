import { useEffect, useState } from "react";
import { getHomeAnnouncement, HomeAnnouncementDto } from "../api/homeAnnouncementApi";
import HtmlContent from "./HtmlContent";

const HomeAnnouncement = () => {
  const [data, setData] = useState<HomeAnnouncementDto | null>(null);

  useEffect(() => {
    getHomeAnnouncement().then(setData).catch(console.error);
  }, []);

  if (!data) return null;

  const showImageBelow =
    data.title === "HARD" && Boolean(data.imageUrl);

  return (
    <section
      className="rounded-2xl p-10 space-y-8"
      style={{ background: "var(--card-bg)" }}
    >
      <header>
        <h1
          className="text-4xl font-extrabold mb-4"
          style={{ color: "var(--text-main)" }}
        >
          {data.title}
        </h1>
      </header>

      <HtmlContent
        html={data.contentHtml}
        className="prose prose-invert max-w-none"
      />

      {showImageBelow && (
        <div className="pt-6">
          <img
            src={data.imageUrl}
            alt="Announcement"
            className="rounded-xl w-full max-h-[420px] object-cover shadow-xl"
          />
        </div>
      )}
    </section>
  );
};

export default HomeAnnouncement;
