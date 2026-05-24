import { StudioMiniDTO } from "../../../api/types/studio.types";
import { StudioCard } from "./StudioCard";

interface Props {
  studios: StudioMiniDTO[];
}

export const StudioGrid: React.FC<Props> = ({ studios }) => {
  // Сортуємо по кількості аніме
  const sortedStudios = [...studios]
    .filter((s, i, arr) => arr.findIndex(a => a.id === s.id) === i) // унікальні
    .sort((a, b) => b.animeCount - a.animeCount);

  return (
    <div className="studio-grid">
      {sortedStudios.map((studio) => (
        <StudioCard key={studio.id} studio={studio} />
      ))}
    </div>
  );
};
