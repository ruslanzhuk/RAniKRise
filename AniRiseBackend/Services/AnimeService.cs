using AniRiseBackend.Data;
using AniRiseBackend.Dtos;
using AniRiseBackend.Dtos.Admin;
using AniRiseBackend.Models;
using AniRiseBackend.Contracts;
using AniRiseBackend.Contracts.Admin;
using AniRiseBackend.Contracts.Anime;
using Microsoft.EntityFrameworkCore;
using AniRiseBackend.Contracts.Jikan;

namespace AniRiseBackend.Services;

public class AnimeService
{
    private readonly AppDbContext _db;

    public AnimeService(AppDbContext db)
    {
        _db = db;
    }

    private static AnimePreviewContract MapToPreview(Anime a) => new AnimePreviewContract
    {
        Id = a.Id,
        Title = a.Title,
        PosterUrl = a.Media
            .Select(m => m.Media?.Url)
            .FirstOrDefault(u => !string.IsNullOrEmpty(u)),
        Type = a.Type.ToString(),
        Year = a.ReleaseDate.Year,
        Episodes = a.Episodes,
        Synopsis = a.Description.Length > 180 ? a.Description[..180] + "..." : a.Description,
        Genres = a.AnimeGenres.Select(g => g.Genre.Name).ToList(),
        Studios = a.AnimeStudios.Select(s => s.Studio.Name).ToList(),
        Score = Math.Round(a.AverageScore, 2)
    };

    private static List<AnimePreviewContract> MapToPreview(IEnumerable<Anime> animes)
    => animes.Select(MapToPreview).ToList();


    private static AnimeDTO MapToDTO(Anime a) => new AnimeDTO(
        a.Id,
        a.Title,
        a.Description,
        a.ReleaseDate,
        a.AverageScore,
        a.AniRiseAverageScore,
        a.Type,
        a.Status,
        a.AnimeGenres.Select(g => g.Genre.Name).ToList(),
        a.AnimeStudios.Select(s => s.Studio.Name).ToList(),
        a.AnimeAuthors.Select(au => au.Author.Name).ToList()
    );

    private static List<AnimeDTO> MapToDTO(IEnumerable<Anime> animes)
    => animes.Select(MapToDTO).ToList();

    private IQueryable<Anime> ApplyFilters(IQueryable<Anime> query, GetAnimeRequest request)
    {
        // SEARCH
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(a =>
                a.Title.ToLower().Contains(search) ||
                (a.JapaneseTitle != null && a.JapaneseTitle.ToLower().Contains(search))
            );
        }

        // GENRE
        if (!string.IsNullOrWhiteSpace(request.Genre))
        {
            query = query.Where(a =>
                a.AnimeGenres.Any(g => g.Genre.Name == request.Genre)
            );
        }

        // TYPE
        if (!string.IsNullOrWhiteSpace(request.Type) &&
            Enum.TryParse<AnimeType>(request.Type, true, out var type))
        {
            query = query.Where(a => a.Type == type);
        }

        // STATUS
        if (!string.IsNullOrWhiteSpace(request.Status) &&
            Enum.TryParse<AnimeStatus>(request.Status, true, out var status))
        {
            query = query.Where(a => a.Status == status);
        }

        // SORTOWANIE
        if (!string.IsNullOrWhiteSpace(request.Order))
        {
            var sortDesc = request.Sort?.ToLower() == "desc";

            query = request.Order.ToLower() switch
            {
                "releasedate" => sortDesc
                    ? query.OrderByDescending(a => a.ReleaseDate)
                    : query.OrderBy(a => a.ReleaseDate),

                "score" => sortDesc
                    ? query.OrderByDescending(a => a.AverageScore)
                    : query.OrderBy(a => a.AverageScore),

                "popularity" => sortDesc
                    ? query.OrderByDescending(a => a.ScoredBy)
                    : query.OrderBy(a => a.ScoredBy),

                _ => query.OrderByDescending(a => a.ReleaseDate)
            };
        }
        else
        {
            query = query.OrderByDescending(a => a.ReleaseDate);
        }

        return query;
    }

    public async Task<List<AnimeDTO>> GetAllAsync(GetAnimeRequest request, CancellationToken ct)
    {
        var query = _db.Animes
            .Include(a => a.AnimeGenres).ThenInclude(ag => ag.Genre)
            .Include(a => a.AnimeStudios).ThenInclude(asd => asd.Studio)
            .Include(a => a.AnimeAuthors).ThenInclude(aa => aa.Author)
            .AsQueryable();

        if (!string.IsNullOrEmpty(request.Search))
            query = query.Where(a => a.Title.ToLower().Contains(request.Search.ToLower()));

        var result = await query
            .Skip((request.Page ?? 0) * (request.Limit ?? 20))
            .Take(request.Limit ?? 20)
            .ToListAsync(ct);

        return result.Select(a => new AnimeDTO(
            a.Id,
            a.Title,
            a.Description,
            a.ReleaseDate,
            a.AverageScore,
            a.AniRiseAverageScore,
            a.Type,
            a.Status,
            a.AnimeGenres.Select(g => g.Genre.Name).ToList(),
            a.AnimeStudios.Select(s => s.Studio.Name).ToList(),
            a.AnimeAuthors.Select(au => au.Author.Name).ToList()
        )).ToList();
    }

    public async Task<AnimeDTO?> GetByIdAsync(long id, CancellationToken ct)
    {
        var anime = await _db.Animes
            .Include(a => a.AnimeGenres).ThenInclude(ag => ag.Genre)
            .Include(a => a.AnimeStudios).ThenInclude(asd => asd.Studio)
            .Include(a => a.AnimeAuthors).ThenInclude(aa => aa.Author)
            .FirstOrDefaultAsync(a => a.Id == id, ct);

        if (anime == null)
            return null;

        return new AnimeDTO(
            anime.Id,
            anime.Title,
            anime.Description,
            anime.ReleaseDate,
            anime.AverageScore,
            anime.AniRiseAverageScore,
            anime.Type,
            anime.Status,
            anime.AnimeGenres.Select(g => g.Genre.Name).ToList(),
            anime.AnimeStudios.Select(s => s.Studio.Name).ToList(),
            anime.AnimeAuthors.Select(au => au.Author.Name).ToList()
        );
    }

    public async Task<AnimeDetailDTO?> GetDetailsAsync(long id, CancellationToken ct = default)
    {
        var anime = await _db.Animes
            .AsNoTracking()
            .Where(a => a.Id == id)
            .Select(a => new
            {
                a.Id,
                a.Title,
                a.Description,
                a.ReleaseDate,

                MalRating = a.AverageScore,
                MalScoredBy = a.ScoredBy,
                AniRiseRating = a.AniRiseAverageScore,
                AniRiseScoredBy = a.AniRiseScoredBy,

                a.Type,
                a.Status
            })
            .FirstOrDefaultAsync(ct);

        if (anime == null)
            return null;

        var genres = await _db.AnimeGenres
            .AsNoTracking()
            .Where(g => g.AnimeId == id)
            .Select(g => g.Genre.Name)
            .ToListAsync(ct);

        var studios = await _db.AnimeStudios
            .AsNoTracking()
            .Where(s => s.AnimeId == id)
            .Select(s => new AnimeStudioDTO
            {
                Id = s.Studio.Id,
                Name = s.Studio.Name
            })
            .ToListAsync(ct);

        var mediaUrls = await _db.AnimeMedias
            .AsNoTracking()
            .Where(m => m.AnimeId == id)
            .Select(m => m.Media.Url)
            .Distinct()
            .ToListAsync(ct);

        var mainCharacters = await _db.AnimeCharacters
            .AsNoTracking()
            .Where(ac => ac.AnimeId == id && ac.Role == CharacterRole.Main)
            .Select(ac => new CharacterAnimeDTO
            {
                Id = ac.Character.Id,
                Title = ac.Character.Name,
                Role = ac.Role.ToString(),
                PosterUrl = ac.Character.Media
                    .Where(cm => cm.Media.Type == MediaType.Character_poster)
                    .Select(cm => cm.Media.Url)
                    .FirstOrDefault()
            })
            .ToListAsync(ct);

        var keyAuthors = await _db.AnimeAuthors
            .AsNoTracking()
            .Where(aa =>
                aa.AnimeId == id &&
                (aa.Role == AuthorRole.Director || aa.Role == AuthorRole.Producer)
            )
            .Select(aa => new AnimeAuthorDTO(
                aa.Author.Id,
                aa.Author.Name,
                aa.Role
            ))
            .Distinct()
            .Take(4)
            .ToListAsync(ct);

        return new AnimeDetailDTO(
            anime.Id,
            anime.Title,
            anime.Description,
            anime.ReleaseDate,

            anime.MalRating,
            anime.MalScoredBy,
            anime.AniRiseRating,
            anime.AniRiseScoredBy,

            anime.Type,
            anime.Status,
            genres,
            studios,
            keyAuthors,
            mediaUrls,
            mainCharacters
        );
    }

    public async Task<List<AnimePreviewContract>> GetPopularAsync(
        GetAnimeRequest request,
        CancellationToken ct)
    {
        IQueryable<Anime> query = _db.Animes
            .Include(a => a.AnimeGenres).ThenInclude(g => g.Genre)
            .Include(a => a.AnimeStudios).ThenInclude(s => s.Studio)
            .Include(a => a.Media).ThenInclude(m => m.Media);

        query = query.Where(a => a.ScoredBy > 300_000);

        query = ApplyFilters(query, request);

        query = query.OrderByDescending(a => a.ScoredBy);

        int limit = request.Limit ?? 18;
        int offset = request.Offset ?? 0;

        query = query.Skip(offset).Take(limit);

        var animes = await query.ToListAsync(ct);
        return MapToPreview(animes);
    }



    public async Task<List<AnimePreviewContract>> GetTopRatedAsync(GetAnimeRequest request, CancellationToken ct)
    {
        var query = _db.Animes
            .Include(a => a.AnimeGenres).ThenInclude(g => g.Genre)
            .Include(a => a.AnimeStudios).ThenInclude(s => s.Studio)
            .Include(a => a.Media).ThenInclude(m => m.Media)
            .AsQueryable();

        query = query.OrderByDescending(a => a.AverageScore);
        query = ApplyFilters(query, request);
        var animes = await query.ToListAsync(ct);
        return MapToPreview(animes);
    }

    public async Task<List<AnimePreviewContract>> GetTopSeriesAsync(GetAnimeRequest request, CancellationToken ct)
    {
        var limit = request.Limit ?? 10;
        var page = request.Page ?? 1;
        var skip = (page - 1) * limit;

        var query = _db.Animes
            .Include(a => a.AnimeGenres).ThenInclude(g => g.Genre)
            .Include(a => a.AnimeStudios).ThenInclude(s => s.Studio)
            .Include(a => a.Media).ThenInclude(m => m.Media)
            .Where(a => a.Type == AnimeType.TV);

        query = ApplyFilters(query, request);

        var animes = await query
            .OrderByDescending(a => a.AverageScore)
            .Skip(skip)
            .Take(limit)
            .ToListAsync(ct);

        return MapToPreview(animes);
    }


    public async Task<List<AnimePreviewContract>> GetTopMoviesAsync(GetAnimeRequest request, CancellationToken ct)
    {
        var limit = request.Limit ?? 10;
        var page = request.Page ?? 1;
        var skip = (page - 1) * limit;

        var query = _db.Animes
            .Include(a => a.AnimeGenres).ThenInclude(g => g.Genre)
            .Include(a => a.Media).ThenInclude(m => m.Media)
            .Include(a => a.AnimeStudios).ThenInclude(s => s.Studio)
            .Where(a => a.Type == AnimeType.Movie);

        query = ApplyFilters(query, request);

        var list = await query
            .OrderByDescending(a => a.AverageScore)
            .Skip(skip)
            .Take(limit)
            .ToListAsync(ct);

        return MapToPreview(list);
    }

    public async Task<List<AnimePreviewContract>> GetCurrentlyAiringAsync(
        GetAnimeRequest request,
        CancellationToken ct
    )
    {
        var query = _db.Animes
            .Include(a => a.AnimeGenres).ThenInclude(g => g.Genre)
            .Include(a => a.AnimeStudios).ThenInclude(s => s.Studio)
            .Include(a => a.Media).ThenInclude(m => m.Media)
            .Where(a => a.Status == AnimeStatus.Ongoing);

        query = ApplyFilters(query, request);

        if (request.Offset.HasValue)
            query = query.Skip(request.Offset.Value);

        if (request.Limit.HasValue)
            query = query.Take(request.Limit.Value);

        var animes = await query.ToListAsync(ct);
        return MapToPreview(animes);
    }


    public async Task<List<AnimePreviewContract>> GetUpcomingAsync(GetAnimeRequest request, CancellationToken ct)
    {
        var query = _db.Animes
            .Include(a => a.AnimeGenres).ThenInclude(g => g.Genre)
            .Include(a => a.AnimeStudios).ThenInclude(s => s.Studio)
            .Include(a => a.Media).ThenInclude(m => m.Media)
            .Where(a => a.Status == AnimeStatus.Upcoming)
            .AsQueryable();

        query = ApplyFilters(query, request);

        var animes = await query.ToListAsync(ct);
        return MapToPreview(animes);
    }

    public async Task<PagedAnimeResult<AnimeCardDTO>> SearchAsync(
    AnimeSearchRequest r,
    CancellationToken ct = default)
    {
        var query = _db.Animes
            .AsNoTracking()
            .Include(a => a.Media)
            .Include(a => a.AnimeGenres).ThenInclude(ag => ag.Genre)
            .Include(a => a.AnimeStudios).ThenInclude(s => s.Studio)
            .AsQueryable();

        // =========================
        // STATUS
        // =========================
        if (r.Statuses?.Any() == true)
            query = query.Where(a => r.Statuses.Contains(a.Status));

        // =========================
        // TYPE
        // =========================
        if (r.Types?.Any() == true)
            query = query.Where(a => r.Types.Contains(a.Type));

        // =========================
        // TV EPISODE RANGES
        // =========================
        if (r.Types?.Contains(AnimeType.TV) == true &&
            (r.ShortTv == true || r.MiddleTv == true || r.LongTv == true))
        {
            query = query.Where(a =>
                (r.ShortTv == true && a.Episodes <= 16) ||
                (r.MiddleTv == true && a.Episodes >= 17 && a.Episodes <= 28) ||
                (r.LongTv == true && a.Episodes >= 29)
            );
        }

        // =========================
        // MIN SCORE
        // =========================
        if (r.MinScore.HasValue)
            query = query.Where(a => a.AverageScore >= r.MinScore.Value);

        // =========================
        // AGE RATING
        // =========================
        if (r.AgeRatings?.Any() == true)
            query = query.Where(a =>
                a.AgeRating.HasValue &&
                r.AgeRatings.Contains(a.AgeRating.Value)
            );

        // =========================
        // GENRES (AND logic)
        // =========================
        if (r.GenreIds?.Any() == true)
        {
            query = query.Where(a =>
                r.GenreIds.All(gid =>
                    a.AnimeGenres.Any(ag => ag.GenreId == gid)
                )
            );
        }

        // =========================
        // YEARS
        // =========================
        if (r.FromDate.HasValue)
        {
            query = query.Where(a =>
                a.ReleaseDate != null &&
                a.ReleaseDate >= r.FromDate.Value
            );
        }

        if (r.ToDate.HasValue)
        {
            query = query.Where(a =>
                a.ReleaseDate != null &&
                a.ReleaseDate <= r.ToDate.Value
            );
        }

        // =========================
        // SORTING
        // =========================
        query = r.SortBy switch
        {
            AnimeSortBy.Score => r.Desc
                ? query.OrderByDescending(a => a.AverageScore)
                : query.OrderBy(a => a.AverageScore),

            AnimeSortBy.Popularity => r.Desc
                ? query.OrderByDescending(a => a.ScoredBy)
                : query.OrderBy(a => a.ScoredBy),

            AnimeSortBy.Alphabet =>
                query.OrderBy(a => a.Title),

            AnimeSortBy.ReleaseDate => r.Desc
                ? query.OrderByDescending(a => a.ReleaseDate)
                : query.OrderBy(a => a.ReleaseDate),

            _ => query.OrderByDescending(a => a.AverageScore)
        };

        // =========================
        // TOTAL COUNT (before paging)
        // =========================
        var totalCount = await query.CountAsync(ct);

        // =========================
        // PAGINATION + PROJECTION
        // =========================
        var page = r.Page <= 0 ? 1 : r.Page;
        var pageSize = r.PageSize <= 0 ? 20 : r.PageSize;

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new AnimeCardDTO
            {
                Id = a.Id,
                Title = a.Title,

                PosterUrl = a.Media
                    .Where(am => am.Media.Type == MediaType.Anime_poster)
                    .Select(am => am.Media.Url)
                    .FirstOrDefault(),

                ShortDescription = a.Description.Length > 120
                    ? a.Description.Substring(0, 120) + "..."
                    : a.Description,

                Type = a.Type,
                Status = a.Status,
                Episodes = a.Episodes,
                ReleaseYear = a.ReleaseDate.Year,
                AgeRating = a.AgeRating,

                Studios = a.AnimeStudios
                    .Select(s => s.Studio.Name)
                    .Take(3)
                    .ToList(),

                Genres = a.AnimeGenres
                    .Select(g => g.Genre.Name)
                    .ToList(),

                AverageScore = Math.Round(a.AverageScore, 2),
                ScoredBy = a.ScoredBy
            })
            .ToListAsync(ct);

        return new PagedAnimeResult<AnimeCardDTO>
        {
            TotalCount = totalCount,
            Page = r.Page,
            PageSize = r.PageSize,
            Items = items
        };
    }


    // ADMIN
    public async Task<(List<AdminAnimeListItemDTO> Items, int TotalCount)>
        GetAdminAnimesAsync(GetAnimeRequest request, CancellationToken ct)
    {
        var query = _db.Animes.AsQueryable();

        // filters
        if (!string.IsNullOrWhiteSpace(request.Search))
            query = query.Where(a => a.Title.Contains(request.Search));

        if (!string.IsNullOrWhiteSpace(request.Type) &&
            Enum.TryParse<AnimeType>(request.Type, true, out var type))
            query = query.Where(a => a.Type == type);

        if (!string.IsNullOrWhiteSpace(request.Status) &&
            Enum.TryParse<AnimeStatus>(request.Status, true, out var status))
            query = query.Where(a => a.Status == status);

        // total count
        var totalCount = await query.CountAsync(ct);

        // page
        var page = request.Page.GetValueOrDefault(1);
        if (page < 1) page = 1;

        var limit = request.Limit.GetValueOrDefault(20);
        if (limit < 1) limit = 20;

        var skip = (page - 1) * limit;

        var items = await query
            .OrderByDescending(a => a.Id)
            .Skip(skip)
            .Take(limit)
            .Select(a => new AdminAnimeListItemDTO(
                a.Id,
                a.Title,
                a.JapaneseTitle,
                a.Type,
                a.Status,
                a.AgeRating,
                a.AverageScore,
                a.Episodes,
                a.Rank,
                a.ReleaseDate,
                a.AnimeGenres.Count,
                a.AnimeStudios.Count,
                a.AnimeAuthors.Count
            ))
            .ToListAsync(ct);

        return (items, totalCount);
    }

    public async Task<AdminAnimeDetailsDTO?> GetAdminDetailsAsync(
        long id,
        CancellationToken ct)
    {
        var anime = await _db.Animes
            .Include(a => a.AnimeGenres)
            .Include(a => a.AnimeStudios)
            .Include(a => a.AnimeAuthors)
            .Include(a => a.AnimeCharacters)
            .FirstOrDefaultAsync(a => a.Id == id, ct);

        if (anime == null)
            return null;

        return new AdminAnimeDetailsDTO
        {
            Id = anime.Id,
            Title = anime.Title,
            JapaneseTitle = anime.JapaneseTitle,
            Description = anime.Description,
            Episodes = anime.Episodes,
            Status = anime.Status,
            Type = anime.Type,
            AgeRating = anime.AgeRating,
            AverageScore = anime.AverageScore,
            ScoredBy = anime.ScoredBy,
            Rank = anime.Rank,
            ReleaseDate = anime.ReleaseDate,

            GenreIds = anime.AnimeGenres
                .Select(x => x.GenreId)
                .ToList(),

            StudioIds = anime.AnimeStudios
                .Select(x => x.StudioId)
                .ToList(),

            Authors = anime.AnimeAuthors
                .Select(x => new AnimeAuthorInputDTO
                {
                    AuthorId = x.AuthorId,
                    Role = x.Role
                })
                .ToList(),

            Characters = anime.AnimeCharacters
                .Select(x => new AnimeCharacterInputDTO
                {
                    CharacterId = x.CharacterId,
                    Role = x.Role
                })
                .ToList()
        };
    }

    public async Task<Anime> CreateAsync(
        CreateAdminAnimeRequest request,
        CancellationToken ct)
    {
        var anime = new Anime
        {
            Title = request.Title,
            JapaneseTitle = request.JapaneseTitle,
            Description = request.Description,
            Episodes = request.Episodes,
            Status = request.Status,
            Type = request.Type,
            AgeRating = request.AgeRating,
            AverageScore = request.AverageScore,
            ScoredBy = request.ScoredBy,
            Rank = request.Rank,
            ReleaseDate = request.ReleaseDate
        };

        _db.Animes.Add(anime);
        await _db.SaveChangesAsync(ct);

        return anime;
    }

    public async Task<bool> UpdateAsync(
        long id,
        UpdateAdminAnimeRequest request,
        CancellationToken ct)
    {
        var anime = await _db.Animes
            .Include(a => a.AnimeGenres)
            .Include(a => a.AnimeStudios)
            .Include(a => a.AnimeAuthors)
            .Include(a => a.AnimeCharacters)
            .FirstOrDefaultAsync(a => a.Id == id, ct);

        if (anime == null)
            return false;

        // base fields
        anime.Title = request.Title;
        anime.JapaneseTitle = request.JapaneseTitle;
        anime.Description = request.Description;
        anime.Episodes = request.Episodes;
        anime.Status = request.Status;
        anime.Type = request.Type;
        anime.AgeRating = request.AgeRating;
        anime.AverageScore = request.AverageScore;
        anime.ScoredBy = request.ScoredBy;
        anime.Rank = request.Rank;
        anime.ReleaseDate = request.ReleaseDate;

        // replace relations
        anime.AnimeGenres =
            request.GenreIds.Select(id => new AnimeGenre { GenreId = id }).ToList();

        anime.AnimeStudios =
            request.StudioIds.Select(id => new AnimeStudio { StudioId = id }).ToList();

        anime.AnimeAuthors =
            request.Authors.Select(a => new AnimeAuthor
            {
                AuthorId = a.AuthorId,
                Role = a.Role
            }).ToList();

        anime.AnimeCharacters =
            request.Characters.Select(c => new AnimeCharacter
            {
                CharacterId = c.CharacterId,
                Role = c.Role
            }).ToList();

        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteAsync(long id, CancellationToken ct)
    {
        var anime = await _db.Animes.FindAsync(new object[] { id }, ct);
        if (anime == null)
            return false;

        _db.Animes.Remove(anime);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<List<AnimeShortDTO>> GetAnimeByCharacterAsync(long characterId)
    {
        return await _db.AnimeCharacters
            .AsNoTracking()
            .Where(ac => ac.CharacterId == characterId)
            .Select(ac => ac.Anime)
            .Distinct()
            .Select(anime => new AnimeShortDTO
            {
                Id = anime.Id,
                Title = anime.Title,
                ImageUrl = anime.Media
                    .Select(am => am.Media)
                    .Where(m => m.Type == MediaType.Anime_poster)
                    .Select(m => m.Url)
                    .FirstOrDefault()
            })
            .ToListAsync();
    }
}