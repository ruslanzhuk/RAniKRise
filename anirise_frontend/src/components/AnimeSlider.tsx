import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Grid } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/grid';
import { Link } from 'react-router-dom';

interface AnimePreview {
  id: number;
  title: string;
  posterUrl?: string;
  type?: string;
  year?: number;
  score?: number;
}

interface AnimeSliderProps {
  animes: AnimePreview[];
  backgroundImage?: string;
  sliderKey: string;
}

const AnimeCard = ({ anime }: { anime: AnimePreview }) => (
  <Link
    to={`/anime/${anime.id}`}
    className="block bg-gray-800/80 p-2 rounded-lg text-center hover:bg-gray-700/80 transform hover:scale-105 duration-200"
  >
    {anime.posterUrl ? (
      <img
        src={anime.posterUrl}
        alt={anime.title}
        className="mx-auto object-cover rounded"
        style={{ width: '160px', height: '220px', borderRadius: '10px', marginBottom: '8px' }}
      />
    ) : (
      <div
        style={{
          width: '160px',
          height: '220px',
          backgroundColor: '#444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#bbb',
          borderRadius: '10px',
          marginBottom: '8px',
        }}
      >
        No Image
      </div>
    )}
    <h3 className="text-sm font-bold text-white truncate">{anime.title}</h3>
    <p className="text-xs text-gray-300">{anime.type || 'N/A'} ({anime.year || 'N/A'})</p>
    <p className="text-xs text-yellow-400 font-semibold">⭐ {anime.score ?? 'N/A'}</p>
  </Link>
);

const AnimeSlider: React.FC<AnimeSliderProps> = ({ animes, backgroundImage, sliderKey }) => {
  const prevClass = `swiper-button-prev-${sliderKey}`;
  const nextClass = `swiper-button-next-${sliderKey}`;

  return (
    <div
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '18px',
        borderRadius: '12px',
        marginBottom: '12px',
        position: 'relative',
      }}
    >
      <Swiper
        modules={[Navigation, Grid]}
        navigation={{
          prevEl: `.${prevClass}`,
          nextEl: `.${nextClass}`,
        }}
        spaceBetween={16}
        slidesPerView={6}
        slidesPerGroup={3}
        grid={{ rows: 2, fill: 'row' }}
        speed={600}
        loop={false}
        watchOverflow={true}
        resistanceRatio={0.85}
        allowTouchMove={true}
        style={{ marginBottom: '20px' }}
      >
        {animes.map(anime => (
          <SwiperSlide key={anime.id}>
            <AnimeCard anime={anime} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={`swiper-button-prev ${prevClass}`} style={{ position: 'absolute', left: 8, top: '45%', zIndex: 20, color: 'white' }} />
      <div className={`swiper-button-next ${nextClass}`} style={{ position: 'absolute', right: 8, top: '45%', zIndex: 20, color: 'white' }} />
    </div>
  );
};

export default AnimeSlider;
