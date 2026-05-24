import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import AnimeSlider from "./AnimeHorizontalSlider";
import { getCurrentlyAiringAnime } from "../api/animeApi";

interface WideSliderProps {
  setHeight?: (height: number) => void;
}

export default function WideSlider({ setHeight }: WideSliderProps) {
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getCurrentlyAiringAnime(20);
      setUpcoming(data);
    };
    load();
  }, []);

  useLayoutEffect(() => {
    if (!sliderRef.current || !setHeight) return;

    const updateHeight = () => {
      setHeight(sliderRef.current!.offsetHeight);
    };

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(sliderRef.current);

    updateHeight();

    return () => observer.disconnect();
  }, [upcoming, setHeight]);

  return (
    <section
      ref={sliderRef}
      className="w-full pl-16 pr-6 pt-6 pb-10 bg-black text-center"
    >
      <h2
        className="
          text-3xl md:text-4xl font-extrabold mb-6
          bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400
          bg-200 animate-gradient-flow
          text-transparent bg-clip-text select-none
        "
      >
        Currently Airing
      </h2>

      {upcoming.length > 0 ? <AnimeSlider animes={upcoming} /> : null}
    </section>
  );
}
