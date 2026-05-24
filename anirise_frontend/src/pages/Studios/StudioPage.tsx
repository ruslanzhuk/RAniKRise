import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { StudioDTO } from "../../api/types/studio.types";
import { getStudioById } from "../../api/studioApi";
import { StudioHeader } from "./components/StudioHeader";
import StudioAnimeList from "./components/StudioAnimeList";

const StudioPage = () => {
  const { id } = useParams<{ id: string }>();
  const [studio, setStudio] = useState<StudioDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getStudioById(Number(id))
      .then(setStudio)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!studio) return <div>Studio not found</div>;

  return (
    <div className="page-container">
      <StudioHeader studio={studio} />
      <StudioAnimeList animes={studio.animes} />
    </div>
  );
};

export default StudioPage;
