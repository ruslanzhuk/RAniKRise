import { useEffect, useState } from "react";
import {
  searchAnime,
  AnimeCardDto,
  AnimeSearchRequest,
  AnimeSortBy,
  PagedAnimeResult
} from "../../api/animeSearchApi";
import AnimeCard from "../../components/AnimeCard";
import FiltersPanel from "../../components/FiltersPanel";
import Pagination from "../../components/Pagination";

const PAGE_SIZE = 50;

const AnimeSearchPage = () => {
  const DEFAULT_FILTERS: AnimeSearchRequest = {
    page: 1,
    pageSize: PAGE_SIZE,
    sortBy: AnimeSortBy.Score, // sort by rating
    desc: true,                // declining
    statuses: undefined,       // all statuses
    types: undefined,          // all types
    genreIds: undefined,       // all genres
    ageRatings: undefined      // all age groups
  };

  const [filters, setFilters] = useState<AnimeSearchRequest>(DEFAULT_FILTERS);
  const [data, setData] = useState<AnimeCardDto[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res: PagedAnimeResult<AnimeCardDto> = await searchAnime(filters);
        setData(res.items);
        setTotal(res.totalCount);
      } catch (err) {
        console.error("Error fetching anime:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [filters]); // starts when filters are changed

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [filters.page]);

  return (
    <div className="flex gap-6 px-6 py-4">
      {/* MAIN GRID */}
      <div className="flex-1">
        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: "var(--text-main)" }}
        >
          Browse Anime
        </h1>

        {loading && <div>Loading...</div>}

        <div className="grid grid-cols-5 gap-4">
          {data.map(anime => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>

        <Pagination
          total={total}
          page={filters.page!}
          pageSize={PAGE_SIZE}
          onChange={page => setFilters(f => ({ ...f, page }))}
        />
      </div>

      {/* FILTERS */}
      <FiltersPanel filters={filters} onChange={setFilters} />
    </div>
  );
};

export default AnimeSearchPage;
