using AniRiseBackend.Dtos;
using AniRiseBackend.Data;
using Microsoft.EntityFrameworkCore;
using AniRiseBackend.Models;

public class StudioService
{
    private readonly AppDbContext _db;

    public StudioService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<StudioDTO>> GetAllAsync(int page = 1, int pageSize = 20)
    {
        var studios = await _db.Studios
            .Include(s => s.Media).ThenInclude(sm => sm.Media)
            .Include(s => s.AnimeStudios).ThenInclude(asd => asd.Anime)
                .ThenInclude(an => an.Media)
            .AsNoTracking()
            .OrderBy(s => s.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return studios.Select(s => new StudioDTO
        {
            Id = s.Id,
            Name = s.Name,
            Description = s.Description,
            Media = s.Media.Select(m => new MediaDTO
            {
                Url = m.Media.Url,
                Type = m.Media.Type.ToString()
            }).ToList(),
            Animes = s.AnimeStudios.Select(asd => new StudioAnimeDTO
            {
                Id = asd.Anime.Id,
                Title = asd.Anime.Title
            }).ToList()
        });
    }

    public async Task<IEnumerable<StudioMiniDTO>> GetAllMiniAsync()
    {
        return await _db.Studios
            .Include(s => s.Media)
                .ThenInclude(sm => sm.Media)
            .AsNoTracking()
            .Select(s => new StudioMiniDTO
            {
                Id = s.Id,
                Name = s.Name,

                PosterUrl = s.Media
                    .Where(sm => sm.Media.Type == MediaType.Studio_poster)
                    .OrderBy(sm => sm.MediaId)
                    .Select(sm => sm.Media.Url)
                    .FirstOrDefault(),

                AnimeCount = s.AnimeStudios.Count
            })
            .OrderByDescending(s => s.AnimeCount)
            .ToListAsync();
    }

    public async Task<StudioDTO?> GetByIdAsync(long id)
    {
        var studio = await _db.Studios
            .Include(s => s.Media).ThenInclude(sm => sm.Media)
            .Include(s => s.AnimeStudios).ThenInclude(asd => asd.Anime)
                .ThenInclude(a => a.Media)
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == id);

        if (studio == null)
            return null;

        return new StudioDTO
        {
            Id = studio.Id,
            Name = studio.Name,
            Description = studio.Description,
            Media = studio.Media.Select(m => new MediaDTO
            {
                Url = m.Media.Url,
                Type = m.Media.Type.ToString()
            }).ToList(),
            Animes = studio.AnimeStudios.Select(asd => new StudioAnimeDTO
            {
                Id = asd.Anime.Id,
                Title = asd.Anime.Title
            }).ToList()
        };
    }

    public async Task<IEnumerable<StudioDTO>> SearchAsync(string query)
    {
        query = query.Trim().ToLower();

        var studios = await _db.Studios
            .Include(s => s.Media).ThenInclude(sm => sm.Media)
            .Include(s => s.AnimeStudios).ThenInclude(asl => asl.Anime)
                .ThenInclude(an => an.Media)
            .AsNoTracking()
            .Where(s => EF.Functions.Like(s.Name.ToLower(), $"%{query}%"))
            .OrderBy(s => s.Name)
            .Take(10)
            .ToListAsync();

        return studios.Select(s => new StudioDTO
        {
            Id = s.Id,
            Name = s.Name,
            Description = s.Description,
            Media = s.Media.Select(m => new MediaDTO
            {
                Url = m.Media.Url,
                Type = m.Media.Type.ToString()
            }).ToList(),
            Animes = s.AnimeStudios.Select(asl => new StudioAnimeDTO
            {
                Id = asl.Anime.Id,
                Title = asl.Anime.Title,
            }).ToList()
        });
    }

    public async Task<IEnumerable<StudioMiniDTO>> SearchMiniAsync(
        string query,
        int page = 1,
        int pageSize = 20)
    {
        query = query.Trim().ToLower();

        return await _db.Studios
            .AsNoTracking()
            .Where(s => EF.Functions.Like(s.Name.ToLower(), $"%{query}%"))
            .OrderByDescending(s => s.AnimeStudios.Count)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => new StudioMiniDTO
            {
                Id = s.Id,
                Name = s.Name,

                PosterUrl = s.Media
                    .Where(sm => sm.Media.Type == MediaType.Studio_poster)
                    .Select(sm => sm.Media.Url)
                    .FirstOrDefault(),

                AnimeCount = s.AnimeStudios.Count
            })
            .ToListAsync();
    }

}