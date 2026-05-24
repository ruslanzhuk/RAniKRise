import { useState, useEffect } from "react";
import { AnimeSearchRequest, AnimeSortBy } from "../api/animeSearchApi";

interface Props {
  filters: AnimeSearchRequest;
  onChange: (f: AnimeSearchRequest) => void;
}

const GENRES = [
  { id: 1, name: "Action" },
  { id: 2, name: "Adventure" },
  { id: 3, name: "Fantasy" },
  { id: 4, name: "Mystery" },
  { id: 5, name: "Suspense" },
  { id: 6, name: "Drama" },
  { id: 7, name: "Horror" },
  { id: 8, name: "Supernatural" },
  { id: 9, name: "Award Winning" },
  { id: 10, name: "Comedy" },
  { id: 11, name: "Romance" },
  { id: 12, name: "Gourmet" },
  { id: 13, name: "Sci-Fi" },
  { id: 14, name: "Ecchi" },
  { id: 15, name: "Girls Love" }
];

const SEASONS = [
  { label: "Spring 2026", fromDate: "2026-03-01", toDate: "2026-05-31" },
  { label: "Summer 2025", fromDate: "2025-06-01", toDate: "2025-08-31" },
  { label: "Autumn 2025", fromDate: "2025-09-01", toDate: "2025-11-30" },
  { label: "Winter 2026", fromDate: "2025-12-01", toDate: "2026-02-28" },
  { label: "2026", fromDate: "2026-01-01", toDate: "2026-12-31" },
  { label: "2025", fromDate: "2025-01-01", toDate: "2025-12-31" },
  { label: "2022-2024", fromDate: "2022-01-01", toDate: "2024-12-31" },
  { label: "2019-2021", fromDate: "2019-01-01", toDate: "2021-12-31" },
  { label: "2010-2018", fromDate: "2010-01-01", toDate: "2018-12-31" },
  { label: "2000-2009", fromDate: "2000-01-01", toDate: "2009-12-31" },
  { label: "1990-1999", fromDate: "1990-01-01", toDate: "1999-12-31" },
  { label: "1980-1989", fromDate: "1980-01-01", toDate: "1989-12-31" },
  { label: "Very old", fromDate: "0001-01-01", toDate: "1979-12-31" }
];

const FiltersPanel = ({ filters, onChange }: Props) => {
  const toggleArray = <T extends any>(arr: T[] | undefined, value: T): T[] => {
    if (!arr) return [value];
    return arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value];
  };

  const toggleStatus = (status: string) =>
    onChange({ ...filters, page: 1, statuses: toggleArray(filters.statuses, status) });

  const toggleType = (type: string) =>
    onChange({ ...filters, page: 1, types: toggleArray(filters.types, type) });

  const toggleGenre = (id: number) =>
    onChange({ ...filters, page: 1, genreIds: toggleArray(filters.genreIds, id) });

  const toggleAgeRating = (rating: string) =>
    onChange({ ...filters, page: 1, ageRatings: toggleArray(filters.ageRatings, rating) });

  const toggleEpisodeRange = (range: "shortTv" | "middleTv" | "longTv") =>
    onChange({ ...filters, page: 1, [range]: !filters[range] });

  const toggleScore = (score: number | undefined) => {
    onChange({
        ...filters,
        page: 1,
        minScore: score
    });
  };

  const toggleSeason = (season: typeof SEASONS[number]) => {
    const isActive =
      filters.fromDate === season.fromDate &&
      filters.toDate === season.toDate;

    onChange({
      ...filters,
      page: 1,
      fromDate: isActive ? undefined : season.fromDate,
      toDate: isActive ? undefined : season.toDate
    });
  };

  return (
    <aside className="w-[280px] space-y-6">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      {/* ================= SORTING ================= */}
      <div>
        <h3 className="font-semibold mb-2">Sorting</h3>

        {[
          { label: "Score", value: AnimeSortBy.Score },
          { label: "Popularity", value: AnimeSortBy.Popularity },
          { label: "Alphabet", value: AnimeSortBy.Alphabet },
          { label: "Release date", value: AnimeSortBy.ReleaseDate }
        ].map(s => (
          <label key={s.value} className="flex gap-2 text-sm">
            <input
              type="radio"
              name="sortBy"
              checked={filters.sortBy === s.value}
              onChange={() =>
                onChange({
                  ...filters,
                  page: 1,
                  sortBy: s.value
                })
              }
            />
            {s.label}
          </label>
        ))}

        {/* Direction */}
        <div className="mt-2 ml-4">
          <label className="flex gap-2 text-sm">
            <input
              type="radio"
              name="sortDir"
              checked={!filters.desc}
              onChange={() =>
                onChange({
                  ...filters,
                  page: 1,
                  desc: false
                })
              }
            />
            Ascending
          </label>

          <label className="flex gap-2 text-sm">
            <input
              type="radio"
              name="sortDir"
              checked={filters.desc === true}
              onChange={() =>
                onChange({
                  ...filters,
                  page: 1,
                  desc: true
                })
              }
            />
            Descending
          </label>
        </div>
      </div>
      
      {/* Status */}
      <div>
        <h3 className="font-semibold mb-2">Status</h3>
        {["Ongoing", "Finished", "Upcoming", "Canceled"].map(s => (
          <label key={s} className="flex gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.statuses?.includes(s)}
              onChange={() => toggleStatus(s)}
            />
            {s}
          </label>
        ))}
      </div>

      {/* Type + TV Episode Ranges */}
      <div>
        <h3 className="font-semibold mb-2">Type</h3>
        {["TV", "Movie", "OVA", "ONA", "Special", "TVShort", "Music"].map(type => (
          <div key={type} className="mb-1">
            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.types?.includes(type)}
                onChange={() => toggleType(type)}
              />
              {type}
            </label>

            {/* TV episode ranges */}
            {type === "TV" && filters.types?.includes("TV") && (
              <div className="ml-6 flex flex-col text-xs gap-1 mt-1">
                <label>
                  <input
                    type="checkbox"
                    checked={filters.shortTv}
                    onChange={() => toggleEpisodeRange("shortTv")}
                  />
                  Short (≤16)
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={filters.middleTv}
                    onChange={() => toggleEpisodeRange("middleTv")}
                  />
                  Middle (17-28)
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={filters.longTv}
                    onChange={() => toggleEpisodeRange("longTv")}
                  />
                  Long (&gt;29)
                </label>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Score */}
      <div>
        <h3 className="font-semibold mb-2">Score</h3>

        <label className="flex gap-2 text-sm">
            <input
            type="radio"
            checked={filters.minScore === undefined}
            onChange={() => toggleScore(undefined)}
            />
            All
        </label>

        {[6, 7, 8].map((score) => (
            <label key={score} className="flex gap-2 text-sm">
            <input
                type="radio"
                checked={filters.minScore === score}
                onChange={() => toggleScore(score)}
            />
            {score}+
            </label>
        ))}
      </div>

      {/* Age Rating */}
      <div>
        <h3 className="font-semibold mb-2">Age Rating</h3>
        {["G", "PG", "PG13", "R17", "RPlus"].map(r => (
          <label key={r} className="flex gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.ageRatings?.includes(r)}
              onChange={() => toggleAgeRating(r)}
            />
            {r}
          </label>
        ))}
      </div>

      {/* Genres */}
      <div>
        <h3 className="font-semibold mb-2">Genres</h3>
        <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
          {GENRES.map(g => (
            <label key={g.id} className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.genreIds?.includes(g.id)}
                onChange={() => toggleGenre(g.id)}
              />
              {g.name}
            </label>
          ))}
        </div>
      </div>

      {/* Seasons / Years */}
      <div>
        <h3 className="font-semibold mb-2">Season / Year</h3>

        {SEASONS.map(s => {
          const checked =
            filters.fromDate === s.fromDate &&
            filters.toDate === s.toDate;

          return (
            <label key={s.label} className="flex gap-2 text-sm">
              <input
                type="radio"
                name="season"
                checked={checked}
                onChange={() =>
                  onChange({
                    ...filters,
                    page: 1,
                    fromDate: s.fromDate,
                    toDate: s.toDate
                  })
                }
              />
              {s.label}
            </label>
          );
        })}

        {/* Clear */}
        <label className="flex gap-2 text-sm mt-1">
          <input
            type="radio"
            name="season"
            checked={!filters.fromDate && !filters.toDate}
            onChange={() =>
              onChange({
                ...filters,
                page: 1,
                fromDate: undefined,
                toDate: undefined
              })
            }
          />
          All
        </label>
      </div>
    </aside>
  );
};

export default FiltersPanel;
