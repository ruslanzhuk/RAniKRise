import { MediaDto } from "../../../../api/types/adminAll.types";

const MediaPreview = ({ media }: { media: MediaDto }) => {
  if (media.url.endsWith(".mp4") || media.url.includes("/video/")) {
    return (
      <video
        src={media.url}
        controls
        className="w-48 h-32 object-cover rounded"
      />
    );
  }

  return (
    <img
      src={media.url}
      alt={media.type}
      className="w-48 h-32 object-cover rounded"
    />
  );
};

export default MediaPreview;
