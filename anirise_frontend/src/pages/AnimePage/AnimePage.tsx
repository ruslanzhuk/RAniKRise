import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getAnimeDetails, AnimeDetailDTO } from "../../api/animeApi";
import { Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { WatchStatusEnum } from "../../api/enums";
import { useAnimeStatus } from "../../hooks/useAnimeStatus";
import RatingModal from "./RatingModal";
import { Link } from "react-router-dom";
import collectionApi from "../../api/collectionApi";
import { CollectionDTO } from "../../api/types/collection.types";
import CommentSection from "../../components/comments/CommentSection";
import mal from "assets/images/mal.png";
import AddToCollectionModal from "../Collections/components/AddToCollectionModal";

const AnimePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [anime, setAnime] = useState<AnimeDetailDTO | null>(null);
  const [loadingAnime, setLoadingAnime] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [collections, setCollections] = useState<CollectionDTO[]>([]);

  const animeId = id ? Number(id) : null;
  const [favorites, setFavorites] = useState<CollectionDTO | null>(null);
  const isFavorite = favorites?.animes.some(a => a.id === animeId);
  const { 
    status, 
    rating, 
    aniRiseRating, 
    aniRiseVotes, 
    loading: loadingStatus, 
    toggleStatus, 
    updateRating 
  } = useAnimeStatus(animeId);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const data = await getAnimeDetails(Number(id));
        setAnime(data);
      } catch (error) {
        console.error("Error fetching anime details:", error);
      } finally {
        setLoadingAnime(false);
      }
    };
    fetchDetails();
  }, [id]);


  const loadCollections = async () => {
    if (!user) return;
    const data = await collectionApi.getMyCollections();
    setCollections(data);
  };

  useEffect(() => {
    loadCollections();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    collectionApi.getFavorites().then(setFavorites);
  }, [user]);

  if (loadingAnime || loadingStatus)
    return <p className="text-center text-white mt-10">Loading...</p>;
  if (!anime)
    return <p className="text-center text-red-500 mt-10">Anime not found</p>;

  const posterUrl = anime.mediaUrls?.[0] || null;

  // --- Handlers ---
  const handleStatusClick = (s: WatchStatusEnum) => toggleStatus(s);

  const handleSetRating = () => {
    const scoreStr = prompt("Enter rating (1-10)", rating?.toString() ?? "");
    if (!scoreStr) return;
    const score = Number(scoreStr);
    if (score >= 1 && score <= 10) updateRating(score);
  };

  const handleAddToCollection = () => {
    alert("Add to collection clicked!");
  };

  const handleToggleFavorite = async () => {
    if (!animeId || !favorites) return;

    try {
      if (isFavorite) {
        await collectionApi.removeAnime(favorites.id, animeId);
        setFavorites({
          ...favorites,
          animes: favorites.animes.filter(a => a.id !== animeId),
        });
      } else {
        await collectionApi.addAnime(favorites.id, animeId);
        setFavorites({
          ...favorites,
          animes: [...favorites.animes, { id: animeId, title: anime!.title, imageUrl: posterUrl ?? undefined }],
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const WatchStatusLabels: Record<WatchStatusEnum, string> = {
    [WatchStatusEnum.Watching]: "Watching",
    [WatchStatusEnum.Completed]: "Completed",
    [WatchStatusEnum.Dropped]: "Dropped",
    [WatchStatusEnum.PlanToWatch]: "Plan To Watch",
    [WatchStatusEnum.OnHold]: "On Hold",
  };

  const statusStyles: Record<
    WatchStatusEnum,
    {
      active: string;
      inactive: string;
    }
  > = {
    [WatchStatusEnum.Watching]: {
      active:
        "bg-blue-500 text-white shadow-blue-500/50 shadow-lg",
      inactive:
        "border border-blue-400 text-blue-400 hover:bg-blue-500/10",
    },

    [WatchStatusEnum.Completed]: {
      active:
        "bg-lime-400 text-black shadow-lime-400/50 shadow-lg",
      inactive:
        "border border-lime-400 text-lime-400 hover:bg-lime-400/10",
    },

    [WatchStatusEnum.Dropped]: {
      active:
        "bg-red-600 text-white shadow-red-600/60 shadow-lg animate-pulse",
      inactive:
        "border border-red-500 text-red-400 hover:bg-red-500/10",
    },

    [WatchStatusEnum.PlanToWatch]: {
      active:
        "bg-purple-600 text-white shadow-purple-600/50 shadow-lg",
      inactive:
        "border border-purple-500 text-purple-400 hover:bg-purple-500/10",
    },

    [WatchStatusEnum.OnHold]: {
      active:
        "bg-yellow-400 text-black shadow-yellow-400/50 shadow-lg",
      inactive:
        "border border-yellow-400 text-yellow-400 hover:bg-yellow-400/10",
    },
  };

  return (
    <>
    <div className="max-w-7xl mx-auto py-10 px-4 text-white">
      {/* Header / Main Info */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="flex-shrink-0">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={anime.title}
              className="w-48 h-64 object-cover border-2 border-gray-600 shadow-md"
            />
          ) : (
            <div className="w-48 h-64 bg-gray-800 border-2 border-gray-600 flex items-center justify-center">
              <p className="text-gray-500">No Poster</p>
            </div>
          )}
        </div>

        {/* Info + Buttons */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{anime.title}</h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              {/* <Star className="text-yellow-400 w-5 h-5 mr-2" /> */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                {/* MAL */}
                <div className="flex items-center gap-1">
                  <img src={mal} alt="MAL" className="w-5 h-5 object-contain" />

                  <span className="font-medium text-gray-100">
                    {anime.malRating ? anime.malRating.toFixed(2) : "—"}
                  </span>

                  <span className="text-gray-400 text-xs">
                    MAL
                    {anime.malScoredBy
                      ? ` • ${anime.malScoredBy.toLocaleString()} votes`
                      : ""}
                  </span>
                </div>

                {/* AniRise */}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="font-medium text-gray-100">
                    {aniRiseVotes > 0 ? aniRiseRating.toFixed(2) : "0"}
                  </span>
                  <span className="text-gray-400">RAniKRise • {aniRiseVotes} votes</span>
                </div>
              </div>

              {/* Favorite Button */}
              <button
                onClick={handleToggleFavorite}
                className={`ml-4 p-2 rounded-full transition-transform duration-200 ${
                  isFavorite ? "text-pink-500 animate-pulse" : "text-gray-400 hover:text-pink-400"
                }`}
                title="Favorite"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={isFavorite ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                  />
                </svg>
              </button>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 text-gray-300 text-sm mb-4">
              <p><span className="text-gray-500">Type:</span> {anime.type || "—"}</p>
              <p><span className="text-gray-500">Status:</span> {anime.status || "—"}</p>
              <p><span className="text-gray-500">Release:</span> {new Date(anime.releaseDate).getFullYear()}</p>
              {/* <p className="col-span-2"><span className="text-gray-500">Studios:</span> {anime.studios?.length ? anime.studios.join(", ") : "Unknown"}</p> */}
              <p className="col-span-2">
                <span className="text-gray-500">Studios:</span>{" "}
                {anime.studios.length ? (
                  anime.studios.map((studio, i) => (
                    <span key={studio.id}>
                      <Link
                        to={`/industry/studios/${studio.id}`}
                        className="text-blue-400 hover:underline transition"
                      >
                        {studio.name}
                      </Link>
                      {i < anime.studios.length - 1 && ", "}
                    </span>
                  ))
                ) : (
                  "Unknown"
                )}
              </p>
              <p className="col-span-2"><span className="text-gray-500">Genres:</span> {anime.genres?.length ? anime.genres.join(", ") : "Unknown"}</p>
            </div>

            {/* Status Buttons */}
            {user ? (
              <>
                {/* Status buttons */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {Object.values(WatchStatusEnum).map((s) => {
                    const active = status === s;

                    return (
                      <button
                        key={s}
                        onClick={() => toggleStatus(s)}
                        className={`
                          w-32 h-10
                          flex items-center justify-center
                          text-sm font-semibold
                          uppercase tracking-wide
                          rounded-md
                          transition-all duration-300
                          ${
                            active
                              ? statusStyles[s].active
                              : statusStyles[s].inactive
                          }
                        `}
                      >
                        {WatchStatusLabels[s]}
                      </button>
                    );
                  })}
                </div>

                {/* Rate button */}
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                            bg-yellow-500/10 text-yellow-400
                            hover:bg-yellow-500/20 transition"
                >
                  <Star className="w-4 h-4" />
                  {rating ? `Your rating: ${rating}/10` : "Rate this anime"}
                </button>

                <button onClick={() => setShowCollections(true)}>
                  ➕ Add to collection
                </button>
              </>
            ) : (
              <p className="text-gray-400">
                Only registered users can add anime to their list and rate them
              </p>
            )}
          </div>

          {/* Synopsis */}
          <div>
            <h2 className="text-xl font-semibold mb-2 border-b border-gray-700 pb-1">Synopsis</h2>
            <p className="text-gray-300 leading-relaxed">{anime.description || "Description not available."}</p>
          </div>
        </div>
      </div>

      {/* Main Characters */}
      {anime.mainCharacters?.length > 0 && (
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-2">
          <h2 className="text-2xl font-semibold text-white">
            Main Characters
          </h2>
          <Link
            to={`/anime/${animeId}/characters`}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition"
          >
            See All Characters
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {anime.mainCharacters.map((char) => (
            <Link
              key={char.id}
              to={`/industry/characters/${char.id}`}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-md
                        hover:scale-105 transform transition duration-300
                        cursor-pointer block"
            >
              {char.posterUrl ? (
                <img
                  src={char.posterUrl}
                  alt={char.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">No Image</p>
                </div>
              )}

              <div className="p-2 text-center">
                <p className="font-medium text-sm">{char.title}</p>
                <p className="text-xs text-gray-400">{char.role}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )}


      {/* Authors / Staff */}
      {anime.authors?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
            Authors
          </h2>

          <ul className="space-y-2">
            {anime.authors.map(author => (
              <li key={author.id}>
                <Link
                  to={`/industry/authors/${author.id}`}
                  className="text-blue-400 hover:underline"
                >
                  {author.name}
                </Link>
                <span className="text-gray-500 text-sm ml-2">
                  ({author.role})
                </span>
              </li>
            ))}
          </ul>

          <Link
            to={`/industry/anime/${anime.id}/authors`}
            className="inline-block mt-3 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-500 transition"
          >
            View all authors
          </Link>
        </div>
      )}

      {/* Media */}
      {anime.mediaUrls?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Media</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {anime.mediaUrls.map((url, idx) => {
              const isVideo = url.toLowerCase().endsWith(".mp4");
              return isVideo ? (
                <video
                  key={idx}
                  src={url}
                  controls
                  className="rounded-lg object-cover w-full h-48 shadow-md hover:opacity-90 transition bg-black"
                />
              ) : (
                <img
                  key={idx}
                  src={url}
                  alt={`Media ${idx + 1}`}
                  className="rounded-lg object-cover w-full h-48 shadow-md hover:opacity-90 transition"
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Comments Section */}
      {animeId && <CommentSection animeId={animeId} />}
    </div>

    {showRatingModal && (
      <RatingModal
        currentRating={rating}
        onClose={() => setShowRatingModal(false)}
        onSelect={(score) => {
          updateRating(score);
          setShowRatingModal(false);
        }}
      />
    )}

    {showCollections && animeId && (
      <AddToCollectionModal
        animeId={animeId}
        collections={collections}
        onClose={() => setShowCollections(false)}
        onSaved={loadCollections}
      />
    )}
    </>
  );
};

export default AnimePage;
