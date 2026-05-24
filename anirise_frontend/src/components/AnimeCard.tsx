import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimeCardDto } from "../api/animeSearchApi";
import { Link } from "react-router-dom";


interface Props {
  anime: AnimeCardDto;
}

const truncate = (text: string, max: number): string =>
  text.length > max ? text.slice(0, max) + "..." : text;

const AnimeCard: React.FC<Props> = ({ anime }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* CLICKABLE BLOCK */}
      <Link to={`/anime/${anime.id}`} className="block w-[170px]">
        {/* POSTER */}
        <img
          src={anime.posterUrl || "/placeholder.png"}
          alt={anime.title}
          className="w-[170px] h-[250px] object-cover rounded-lg shadow-md"
        />

        {/* TITLE */}
        <h3
          className="mt-2 text-sm font-semibold leading-tight"
          style={{ color: "var(--text-main)" }}
        >
          {truncate(anime.title, 18)}
        </h3>

        {/* YEAR + TYPE */}
        <div
          className="flex justify-between text-xs mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          <span>{anime.releaseYear}</span>
          <span>{anime.type}</span>
        </div>
      </Link>

      {/* HOVER PANEL */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 left-[180px] w-80 rounded-lg p-4 shadow-lg z-50"
            style={{
              background: "var(--card-bg)",
              color: "var(--text-main)"
            }}
          >
            {/* STRAIGHT ARROW */}
            <div
              className="absolute left-[-8px] top-8 w-0 h-0 border-t-8 border-b-8 border-r-8
                        border-t-transparent border-b-transparent"
              style={{ borderRightColor: "var(--card-bg)" }}
            />

            {/* CONTENT */}
            <h3 className="text-lg font-bold mb-1">{anime.title}</h3>
            <p
              className="text-sm mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              {anime.shortDescription.length > 120
                ? anime.shortDescription.slice(0, 120) + "..."
                : anime.shortDescription}
            </p>

            <div className="text-xs space-y-1">
              <div>
                <span className="font-semibold">Type:</span> {anime.type}
              </div>
              <div>
                <span className="font-semibold">Status:</span> {anime.status}
              </div>
              <div>
                <span className="font-semibold">Release Year:</span> {anime.releaseYear}
              </div>
              <div>
                <span className="font-semibold">Episodes:</span> {anime.episodes}
              </div>
              <div>
                <span className="font-semibold">Age Rating:</span>{" "}
                {anime.ageRating || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Studios:</span>{" "}
                {anime.studios.slice(0, 3).join(", ") || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Genres:</span>{" "}
                {anime.genres.join(", ") || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Score:</span> {anime.averageScore}{" "}
                {anime.scoredBy && `(${anime.scoredBy} votes)`}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimeCard;
