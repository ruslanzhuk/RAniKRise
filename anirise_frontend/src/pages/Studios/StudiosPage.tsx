import { useEffect, useState } from "react";
import { StudioMiniDTO } from "../../api/types/studio.types";
import { getStudiosMini } from "../../api/studioApi";

import { StudioGrid } from "./components/StudioGrid";
import { StudioSearch } from "./components/StudioSearch";
import { EmptyStudios } from "./components/EmptyStudios";

const StudiosPage: React.FC = () => {
  const [studios, setStudios] = useState<StudioMiniDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudiosMini()
      .then(setStudios)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container_studios">
      <StudioSearch onResults={setStudios} />

      {loading ? (
        <div style={{ color: "var(--text-main)" }}>Loading...</div>
      ) : studios.length > 0 ? (
        <StudioGrid studios={studios} />
      ) : (
        <EmptyStudios />
      )}
    </div>
  );
};

export default StudiosPage;
