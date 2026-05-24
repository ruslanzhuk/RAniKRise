import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Anime } from "../api/animeApi";

interface Props {
  animes: Anime[];
}

const STEP = 3;
const POSTER_ASPECT = 1.38;
const MIN_VISIBLE = 3;
// const MAX_VISIBLE = 9;
const BLOCK_PADDING = 8;
const INNER_PADDING = 12;
const VERTICAL_MARGIN = 12;

const AnimeSlider: React.FC<Props> = ({ animes }) => {
  const total = animes.length;
  const repeated = [...animes, ...animes, ...animes];
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(total);
  const [visibleCount, setVisibleCount] = useState(MIN_VISIBLE);
  const [posterWidth, setPosterWidth] = useState(0);
  const [posterHeight, setPosterHeight] = useState(0);
  const [titleFontSize, setTitleFontSize] = useState("0.9rem");

  const updateSizes = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    let possibleVisible = Math.floor(
      containerWidth / 150
    );
    possibleVisible = Math.max(MIN_VISIBLE, possibleVisible);
    setVisibleCount(possibleVisible);
    const totalExtra = possibleVisible * (2 * BLOCK_PADDING + 2 * INNER_PADDING);
    const pw = (containerWidth - totalExtra) / possibleVisible;
    setPosterWidth(pw);
    setPosterHeight(pw * POSTER_ASPECT);
    if (pw > 180) setTitleFontSize("1rem");
    else if (pw > 140) setTitleFontSize("0.9rem");
    else setTitleFontSize("0.8rem");
  };

  useEffect(() => {
    updateSizes();
    const observer = new ResizeObserver(updateSizes);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const blockWidth = posterWidth + 2 * BLOCK_PADDING + 2 * INNER_PADDING;

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.style.transition = "none";
    indexRef.current = total;
    slider.style.transform = `translateX(-${indexRef.current * blockWidth}px)`;
  }, [blockWidth, total]);

  const move = (dir: number) => {
    const slider = sliderRef.current;
    if (!slider) return;
    indexRef.current += dir;
    slider.style.transition = "transform 0.35s ease";
    slider.style.transform = `translateX(-${indexRef.current * blockWidth}px)`;
    const handle = () => {
      if (indexRef.current >= total * 2 || indexRef.current < total) {
        indexRef.current = total + (indexRef.current % total);
        slider.style.transition = "none";
        slider.style.transform = `translateX(-${indexRef.current * blockWidth}px)`;
      }
      slider.removeEventListener("transitionend", handle);
    };
    slider.addEventListener("transitionend", handle);
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden w-full"
      style={{ paddingTop: VERTICAL_MARGIN, paddingBottom: VERTICAL_MARGIN }}
    >
      <div ref={sliderRef} className="flex">
        {repeated.map((anime, i) => {
          const title =
            anime.title.length > 50 ? anime.title.slice(0, 50) + "..." : anime.title;
          return (
            <div
              key={i}
              className="flex-shrink-0"
              style={{ width: blockWidth, paddingLeft: BLOCK_PADDING, paddingRight: BLOCK_PADDING }}
            >
              <Link
                to={`/anime/${anime.id}`}
                className="group block rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/40"
                style={{ 
                  paddingLeft: INNER_PADDING, 
                  paddingRight: INNER_PADDING, 
                  paddingTop: INNER_PADDING / 2, 
                  paddingBottom: INNER_PADDING / 2 
                }}
              >
                <div className="relative overflow-hidden rounded-md">
                  <img
                    src={anime.posterUrl}
                    alt={anime.title}
                    style={{ width: posterWidth, height: posterHeight }}
                    className="rounded-md shadow-md transition-all duration-300 group-hover:brightness-110 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-md" />
                </div>
                <p
                  className="text-center mt-2 whitespace-nowrap overflow-hidden"
                  style={{ fontSize: titleFontSize }}
                >
                  {title}
                </p>
                <p className="text-xs text-green-400 text-center mt-1">
                  ★ {anime.score || "N/A"}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
      <button
        className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/70 p-2 rounded-full text-white z-10"
        onClick={() => move(-STEP)}
      >
        ◀
      </button>
      <button
        className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/70 p-2 rounded-full text-white z-10"
        onClick={() => move(STEP)}
      >
        ▶
      </button>
    </div>
  );
};

export default AnimeSlider;