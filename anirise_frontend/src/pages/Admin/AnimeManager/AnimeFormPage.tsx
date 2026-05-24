import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  AnimeAgeRating,
  AnimeStatus,
  AnimeType,
  AuthorRole,
  CharacterRole,
  CreateAnimeAdminDTO,
  UpdateAnimeAdminDTO,
  AdminGenreDTO,
  AnimeAuthorInputDTO,
  AnimeCharacterInputDTO,
} from "../../../api/types/adminAll.types";

import {
  adminCreateAnime,
  adminGetAnimeById,
  adminGetGenres,
  adminUpdateAnime,
} from "../../../api/adminApi";

const emptyCreateForm: CreateAnimeAdminDTO = {
  title: "",
  japaneseTitle: "",
  description: "",
  episodes: 0,
  type: AnimeType.TV,
  status: AnimeStatus.Ongoing,
  ageRating: undefined,
  averageScore: 0,
  scoredBy: undefined,
  rank: undefined,
  releaseDate: new Date().toISOString().split("T")[0],

  genreIds: [],
  studioIds: [],
  authors: [],
  characters: [],
};

const AnimeFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateAnimeAdminDTO | UpdateAnimeAdminDTO>(emptyCreateForm);
  const [genres, setGenres] = useState<AdminGenreDTO[]>([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     Load genres
  ========================= */
  useEffect(() => {
    adminGetGenres().then(setGenres);
  }, []);

  /* =========================
     Load anime if edit
  ========================= */
  useEffect(() => {
    if (!isEdit) return;

    setLoading(true);
    adminGetAnimeById(Number(id))
      .then((anime) => {
        setForm({
          ...anime,
          releaseDate: anime.releaseDate.split("T")[0],
        });
      })
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  /* =========================
     Handlers
  ========================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : Number(value),
    }));
  };

  const handleIdsChange = (name: "studioIds", value: string) => {
    const ids = value
      .split(",")
      .map((v) => Number(v.trim()))
      .filter((v) => !isNaN(v));
    setForm((prev) => ({ ...prev, [name]: ids }));
  };

  const toggleGenre = (id: number) => {
    setForm((prev) => ({
      ...prev,
      genreIds: prev.genreIds.includes(id)
        ? prev.genreIds.filter((x) => x !== id)
        : [...prev.genreIds, id],
    }));
  };

  /* =========================
     Authors (edit only)
  ========================= */
  const addAuthor = () => {
    setForm((prev) => ({
      ...prev,
      authors: [...prev.authors, { authorId: 0, role: AuthorRole.OriginalCreator }],
    }));
  };
  const updateAuthor = (i: number, field: "authorId" | "role", value: any) => {
    setForm((prev) => {
      const authors = [...prev.authors];
      authors[i] = { ...authors[i], [field]: value };
      return { ...prev, authors };
    });
  };
  const removeAuthor = (i: number) => {
    setForm((prev) => ({ ...prev, authors: prev.authors.filter((_, idx) => idx !== i) }));
  };

  /* =========================
     Characters (edit only)
  ========================= */
  const addCharacter = () => {
    setForm((prev) => ({
      ...prev,
      characters: [...prev.characters, { characterId: 0, role: CharacterRole.Main }],
    }));
  };
  const updateCharacter = (i: number, field: "characterId" | "role", value: any) => {
    setForm((prev) => {
      const characters = [...prev.characters];
      characters[i] = { ...characters[i], [field]: value };
      return { ...prev, characters };
    });
  };
  const removeCharacter = (i: number) => {
    setForm((prev) => ({ ...prev, characters: prev.characters.filter((_, idx) => idx !== i) }));
  };

  /* =========================
     Submit
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      await adminUpdateAnime(Number(id), form as UpdateAnimeAdminDTO);
      navigate(`/xkey/broadmin/anime/${id}`);
    } else {
      const newId = await adminCreateAnime(form as CreateAnimeAdminDTO);
      navigate(`/xkey/broadmin/anime/${newId}`);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  /* =========================
     Render
  ========================= */
  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{isEdit ? "Edit Anime" : "Create Anime"}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic fields */}
        <div>
          <label className="block font-bold">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="input w-full" required />
        </div>
        <div>
          <label className="block font-bold">Japanese Title</label>
          <input name="japaneseTitle" value={form.japaneseTitle ?? ""} onChange={handleChange} className="input w-full" />
        </div>
        <div>
          <label className="block font-bold">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="input w-full" required />
        </div>
        <div>
          <label className="block font-bold">Episodes</label>
          <input type="number" value={form.episodes} onChange={(e) => handleNumberChange("episodes", e.target.value)} className="input w-full" />
        </div>
        <div className="flex gap-4">
          <div>
            <label className="block font-bold">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="input">
              {Object.values(AnimeType).map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-bold">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="input">
              {Object.values(AnimeStatus).map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-bold">Age Rating</label>
            <select name="ageRating" value={form.ageRating ?? ""} onChange={handleChange} className="input">
              <option value="">--</option>
              {Object.values(AnimeAgeRating).map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <label className="block font-bold">Average Score</label>
            <input type="number" value={form.averageScore} onChange={(e) => handleNumberChange("averageScore", e.target.value)} className="input" />
          </div>
          <div>
            <label className="block font-bold">Scored By</label>
            <input type="number" value={form.scoredBy ?? ""} onChange={(e) => handleNumberChange("scoredBy", e.target.value)} className="input" />
          </div>
          <div>
            <label className="block font-bold">Rank</label>
            <input type="number" value={form.rank ?? ""} onChange={(e) => handleNumberChange("rank", e.target.value)} className="input" />
          </div>
        </div>
        <div>
          <label className="block font-bold">Release Date</label>
          <input type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} className="input w-full" />
        </div>

        {/* Only for edit */}
        {isEdit && (
          <>
            {/* Genres */}
            <div>
              <label className="block font-bold mb-2">Genres</label>
              <div className="flex flex-wrap gap-2">
                {genres.map(g => (
                  <label key={g.id} className="flex items-center gap-1">
                    <input type="checkbox" checked={form.genreIds.includes(g.id)} onChange={() => toggleGenre(g.id)} />
                    {g.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Studios */}
            <div>
              <label className="block font-bold">Studios IDs (comma separated)</label>
              <input type="text" value={form.studioIds.join(", ")} onChange={(e) => handleIdsChange("studioIds", e.target.value)} className="input w-full" />
            </div>

            {/* Authors */}
            <div>
              <label className="block font-bold mb-2">Authors</label>
              {form.authors.map((a, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input type="number" value={a.authorId} onChange={e => updateAuthor(i, "authorId", Number(e.target.value))} className="input w-32" />
                  <select value={a.role} onChange={e => updateAuthor(i, "role", e.target.value)} className="input">
                    {Object.values(AuthorRole).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <button type="button" onClick={() => removeAuthor(i)}>✕</button>
                </div>
              ))}
              <button type="button" onClick={addAuthor}>+ Add author</button>
            </div>

            {/* Characters */}
            <div>
              <label className="block font-bold mb-2">Characters</label>
              {form.characters.map((c, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input type="number" value={c.characterId} onChange={e => updateCharacter(i, "characterId", Number(e.target.value))} className="input w-32" />
                  <select value={c.role} onChange={e => updateCharacter(i, "role", e.target.value)} className="input">
                    {Object.values(CharacterRole).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <button type="button" onClick={() => removeCharacter(i)}>✕</button>
                </div>
              ))}
              <button type="button" onClick={addCharacter}>+ Add character</button>
            </div>
          </>
        )}

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
          {isEdit ? "Save Changes" : "Create Anime"}
        </button>
      </form>
    </div>
  );
};

export default AnimeFormPage;
