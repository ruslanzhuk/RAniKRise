import { Link } from "react-router-dom";

const MediaManagerHome = () => {
  return (
    <div className="p-6 grid grid-cols-2 gap-4">
      <Link to="anime" className="p-4 border rounded">
        Anime
      </Link>
      <Link to="authors" className="p-4 border rounded">
        Authors
      </Link>
      <Link to="characters" className="p-4 border rounded">
        Characters
      </Link>
      <Link to="studios" className="p-4 border rounded">
        Studios
      </Link>
    </div>
  );
};

export default MediaManagerHome;
