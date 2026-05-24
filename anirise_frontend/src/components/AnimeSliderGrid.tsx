import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimePreview } from "../api/animeApi";

interface Props {
  animes: AnimePreview[];
  backgroundImage?: string;
}

const ITEMS_PER_PAGE = 14; // 7 × 2 rows

const AnimeSliderGrid: React.FC<Props> = ({ animes, backgroundImage }) => {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(animes.length / ITEMS_PER_PAGE);
  const start = page * ITEMS_PER_PAGE;
  const visible = animes.slice(start, start + ITEMS_PER_PAGE);

  const handlePrev = () => setPage(p => Math.max(p - 1, 0));
  const handleNext = () => setPage(p => Math.min(p + 1, totalPages - 1));

  return (
    <div
      className="relative w-full rounded-xl p-6 my-10 shadow-xl"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* GRID POSTERS */}
      <div className="
        grid gap-6
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        xl:grid-cols-7
      ">
        {visible.map(a => (
          <Link
            key={a.id}
            to={`/anime/${a.id}`}
            className="group block"
          >
            <div className="
                bg-black/50 backdrop-blur-sm 
                p-3 rounded-xl shadow-lg 
                hover:bg-black/60 
                transition-all duration-200
            ">
              <img
                src={a.posterUrl || "/assets/images/default_avatar_7665.png"}
                alt={a.title}
                className="
                  w-full
                  object-cover rounded-lg 
                  mb-2
                  transition-transform 
                  duration-300 
                  group-hover:scale-105
                " 
                style={{
                  height: "230px",
                  borderRadius: "12px"
                }}
              />

              <h3 className="text-sm font-bold text-white truncate">
                {a.title}
              </h3>

              <p className="text-xs text-gray-300">
                {a.type || "N/A"} ({a.year || "?"})
              </p>

              {a.score !== undefined && (
                <p className="text-xs text-yellow-400 font-bold">
                  ⭐ {a.score.toFixed(1)}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* BUTTONY PRZESUWANIA */}
      {totalPages > 1 && (
        <>
          <button
            onClick={handlePrev}
            disabled={page === 0}
            className="
              absolute left-2 top-1/2 -translate-y-1/2
              bg-black/60 p-3 rounded-full text-white
              hover:bg-black/80
            "
          >
            ◀
          </button>

          <button
            onClick={handleNext}
            disabled={page === totalPages - 1}
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              bg-black/60 p-3 rounded-full text-white
              hover:bg-black/80
            "
          >
            ▶
          </button>
        </>
      )}
    </div>
  );
};

export default AnimeSliderGrid;
