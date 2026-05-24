import { Link } from "react-router-dom";
import { StudioMiniDTO } from "../../../api/types/studio.types";
import notFoundPoster from "../../../assets/images/not_found.png";


interface Props {
  studio: StudioMiniDTO;
}

export const StudioCard: React.FC<Props> = ({ studio }) => {
  return (
    <Link to={`/industry/studios/${studio.id}`} className="studio-card">
      <img
        src={studio.posterUrl || notFoundPoster}
        alt={studio.name}
        className="studio-card-image"
      />
      <div className="studio-card-info">
        <h3>{studio.name}</h3>
        <span>{studio.animeCount} anime</span>
      </div>
    </Link>
  );
};
