import { Link } from "react-router-dom";

export interface StudioAnimeDTO {
  id: number;
  title: string;
}

interface Props {
  animes: StudioAnimeDTO[];
}

const StudioAnimeList: React.FC<Props> = ({ animes }) => {
  if (!animes.length) {
    return (
      <p className="studio-anime-empty">
        No anime found for this studio.
      </p>
    );
  }

  const sortedAnimes = [...animes].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  return (
    <div className="studio-anime-list">
      <h2>Anime by this studio</h2>

      <ul className="studio-anime-links">
        {sortedAnimes.map(anime => (
          <li key={anime.id}>
            <Link to={`/anime/${anime.id}`}>
              {anime.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudioAnimeList;
