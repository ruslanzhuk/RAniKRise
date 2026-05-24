import { StudioDTO } from "../../../api/types/studio.types";
import notFound from "../../../assets/images/not_found.png";

interface Props {
  studio: StudioDTO;
}

export const StudioHeader: React.FC<Props> = ({ studio }) => {
  const poster =
    studio.media.find(m => m.type === "Studio_poster")?.url ?? notFound;

  return (
    <div className="studio-header">
      <img
        src={poster}
        alt={studio.name}
        className="studio-header-poster"
      />

      <div className="studio-header-info">
        <h1>{studio.name}</h1>

        <p>
          {studio.description?.trim()
            ? studio.description
            : "Description is not available."}
        </p>

        <div className="studio-header-meta">
          <span>{studio.animes.length} anime</span>
        </div>
      </div>
    </div>
  );
};
