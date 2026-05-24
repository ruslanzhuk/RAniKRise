import React, { useState } from "react";
import {
  importAnimeById,
  ImportAnimeResult,
} from "../../../api/importApi";

const ImportForm: React.FC = () => {
  const [animeId, setAnimeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportAnimeResult | null>(null);
  const [error, setError] = useState<any | null>(null);

  const handleImport = async () => {
    if (!animeId || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await importAnimeById(Number(animeId));
      setResult(data);
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        const response = (err as any).response;
        setError(response?.data ?? { message: "Import failed" });
      } else {
        setError({ message: "Unexpected error occurred" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 max-w-2xl shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-gray-900">
        Anime Import (Admin)
      </h2>

      {/* Table-like layout */}
      <div className="grid grid-cols-[160px_1fr_120px] gap-4 items-center">
        <label className="text-gray-700 text-sm">
          MAL Anime ID
        </label>

        <input
          type="number"
          placeholder="e.g. 5114"
          value={animeId}
          onChange={(e) => setAnimeId(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={handleImport}
          disabled={loading || !animeId}
          className="bg-purple-600 hover:bg-purple-500 transition py-2 rounded-lg text-white disabled:opacity-50"
        >
          Import
        </button>
      </div>

      {/* Info */}
      <p className="mt-4 text-sm text-gray-500">
        ℹ️ Import may take from a few seconds to several minutes. Please do not refresh the page.
      </p>

      {/* Loader */}
      {loading && (
        <div className="mt-6 flex items-center gap-4 bg-gray-100 border border-gray-300 rounded-lg p-4">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <div className="text-gray-800 text-sm">
            Importing anime data…
            <br />
            <span className="text-gray-500">
              This process can take a long time.
            </span>
          </div>
        </div>
      )}

      {/* Success */}
      {result && (
        <div className="mt-6 bg-green-100 border border-green-400 rounded-lg p-4">
          <p className="text-green-700 font-semibold mb-2">
            ✅ Import successful
          </p>
          <p className="text-sm text-gray-800">
            <strong>{result.title}</strong>
            {result.japaneseTitle && ` (${result.japaneseTitle})`}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 bg-red-100 border border-red-400 rounded-lg p-4">
          <p className="text-red-700 font-semibold mb-2">
            ❌ Import failed
          </p>

          <pre className="text-sm text-gray-800 whitespace-pre-wrap">
{JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ImportForm;
