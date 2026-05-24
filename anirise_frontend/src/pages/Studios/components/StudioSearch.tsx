import { useState } from "react";
import { searchStudios } from "../../../api/studioApi";
import { StudioMiniDTO } from "../../../api/types/studio.types";

interface Props {
  onResults: (studios: StudioMiniDTO[]) => void;
}

export const StudioSearch: React.FC<Props> = ({ onResults }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const results = await searchStudios(query.trim());
    onResults(results);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex mb-6 gap-2"
    >
      <input
        type="text"
        placeholder="Search studios..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="
          flex-1
          p-2
          rounded-md
          bg-gray-800
          text-white
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-purple-500
        "
      />
      <button
        type="submit"
        className="
          px-4
          rounded-md
          bg-purple-600
          text-white
          hover:bg-purple-500
          transition
        "
      >
        Search
      </button>
    </form>
  );
};
