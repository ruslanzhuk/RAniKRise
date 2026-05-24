using AniRiseBackend.Models;
using AniRiseBackend.Dtos;
using AniRiseBackend.Data;
using Microsoft.EntityFrameworkCore;

namespace AniRiseBackend.Services;

public class AuthorService
{
    private readonly AppDbContext _db;

    public AuthorService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<AuthorDTO>> GetAllAsync(int page = 1, int pageSize = 20)
    {
        var authors = await _db.Authors
        .Include(a => a.Media).ThenInclude(am => am.Media)
        .Include(a => a.AnimeAuthors)
            .ThenInclude(aa => aa.Anime)
                .ThenInclude(an => an.Media)
        .AsNoTracking()
        .OrderBy(a => a.Name)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

        return authors.Select(a => new AuthorDTO
        {
            Id = a.Id,
            Name = a.Name,
            Bio = a.Bio,
            Media = a.Media.Select(m => new MediaDTO
            {
                Url = m.Media.Url,
                Type = m.Media.Type.ToString()
            }).ToList(),

            Animes = a.AnimeAuthors
                .Where(aa => aa.Anime != null)
                .GroupBy(aa => aa.Anime)
                .Select(g => new AuthorAnimeDTO
                {
                    Id = g.Key.Id,
                    Title = g.Key.Title,
                    Roles = g.Select(x => x.Role.ToString()).Distinct().ToList(),
                    PosterUrl = g.Key.Media?
                        .Select(am => am.Media?.Url)
                        .FirstOrDefault(u => !string.IsNullOrEmpty(u))
                }).ToList()
        });
    }

    public async Task<AuthorDTO?> GetByIdAsync(long id)
    {
        var author = await _db.Authors
            .Include(a => a.Media).ThenInclude(am => am.Media)
            .Include(a => a.AnimeAuthors).ThenInclude(aa => aa.Anime)
                .ThenInclude(an => an.Media)
                    .ThenInclude(am => am.Media)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);

        if (author == null)
            return null;

        return new AuthorDTO
        {
            Id = author.Id,
            Name = author.Name,
            Bio = author.Bio,
            Media = author.Media
                .Select(m => new MediaDTO
                {
                    Url = m.Media?.Url ?? string.Empty,
                    Type = m.Media?.Type.ToString() ?? string.Empty
                })
                .ToList(),

            Animes = author.AnimeAuthors
                .Where(aa => aa.Anime != null)
                .GroupBy(aa => aa.Anime) // групуємо по самому об’єкту Anime
                .Select(g => new AuthorAnimeDTO
                {
                    Id = g.Key.Id,
                    Title = g.Key.Title,
                    Roles = g.Select(a => a.Role.ToString()).Distinct().ToList(),
                    PosterUrl = g.Key.Media?
                        .Select(am => am.Media)
                        .Where(m => m != null && m.Type == MediaType.Anime_poster)
                        .Select(m => m.Url)
                        .FirstOrDefault() 
                })
                .ToList()
        };
    }


    public async Task<IEnumerable<AuthorDTO>> GetByAnimeIdAsync(long animeId)
    {
        var authors = await _db.AnimeAuthors
            .AsNoTracking()
            .Where(aa => aa.AnimeId == animeId)
            .Include(aa => aa.Author)
                .ThenInclude(a => a.Media)
                    .ThenInclude(am => am.Media)
            .Include(aa => aa.Anime)
                .ThenInclude(an => an.Media)
                    .ThenInclude(am => am.Media)
            .ToListAsync();

        var grouped = authors
            .GroupBy(aa => aa.Author)
            .Select(g => new AuthorDTO
            {
                Id = g.Key.Id,
                Name = g.Key.Name,
                Bio = g.Key.Bio,
                Media = g.Key.Media
                    .Select(m => new MediaDTO
                    {
                        Url = m.Media?.Url ?? string.Empty,
                        Type = m.Media?.Type.ToString() ?? string.Empty
                    })
                    .ToList(),

                Animes = g
                    .Where(aa => aa.Anime != null)
                    .Select(aa => new AuthorAnimeDTO
                    {
                        Id = aa.Anime.Id,
                        Title = aa.Anime.Title,
                        Roles = g.Where(x => x.AnimeId == aa.Anime.Id)
                                .Select(x => x.Role.ToString())
                                .Distinct()
                                .ToList(),

                        PosterUrl = aa.Anime?.Media?
                            .Select(am => am.Media)
                            .Where(m => m != null && m.Type == MediaType.Anime_poster)
                            .Select(m => m.Url)
                            .FirstOrDefault()
                    })
                    .ToList()
            });

        return grouped;
    }



    public async Task<IEnumerable<AuthorDTO>> SearchAsync(string query)
    {
        query = query.Trim().ToLower();

        var authors = await _db.Authors
            .Include(a => a.Media).ThenInclude(am => am.Media)
            .Include(a => a.AnimeAuthors).ThenInclude(aa => aa.Anime)
                .ThenInclude(an => an.Media)
            .AsNoTracking()
            .Where(a => EF.Functions.Like(a.Name.ToLower(), $"%{query}%"))
            .OrderBy(a => a.Name)
            .Take(10)
            .ToListAsync();

        var result = authors.Select(a => new AuthorDTO
        {
            Id = a.Id,
            Name = a.Name,
            Bio = a.Bio,
            Media = a.Media.Select(m => new MediaDTO
            {
                Url = m.Media.Url,
                Type = m.Media.Type.ToString()
            }).ToList(),
            Animes = a.AnimeAuthors
                .Where(aa => aa.Anime != null)
                .GroupBy(aa => aa.Anime)
                .Select(g => new AuthorAnimeDTO
                {
                    Id = g.Key.Id,
                    Title = g.Key.Title,
                    Roles = g.Select(x => x.Role.ToString()).Distinct().ToList(),
                    PosterUrl = g.Key.Media?
                        .Select(am => am.Media?.Url)
                        .FirstOrDefault(u => !string.IsNullOrEmpty(u))
                }).ToList()
        });

        return result;
    }
}