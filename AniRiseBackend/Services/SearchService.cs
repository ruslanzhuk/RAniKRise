using AniRiseBackend.Data;
using AniRiseBackend.Models;
using Microsoft.EntityFrameworkCore;
using AniRiseBackend.Dtos;
using AniRiseBackend.Contracts;

namespace AniRiseBackend.Services;

public class SearchService
{
    private readonly AppDbContext _db;

    public SearchService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<SearchResultDTO> SearchAsync(
        SearchType type,
        string query,
        int page,
        int pageSize,
        CancellationToken ct)
    {
        var result = new SearchResultDTO();

        bool all = type == SearchType.All;

        // ANIME
        if (all || type == SearchType.Anime)
        {
            var animeQuery = _db.Animes
                .Where(a => EF.Functions.Like(a.Title, $"%{query}%"))
                .AsQueryable();

            result.TotalResults += await animeQuery.CountAsync(ct);

            result.Animes = await animeQuery
                .OrderBy(a => a.Title)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new AnimeSearchDTO
                {
                    Id = a.Id,
                    Title = a.Title,
                    Rating = a.AverageScore,

                    PosterUrl =
                        a.Media
                            .Where(am =>
                                am.Media.Type == MediaType.Anime_poster ||
                                am.Media.Type == MediaType.Anime_poster_inactive
                            )
                            .OrderBy(am => am.MediaId)
                            .Select(am => am.Media.Url)
                            .FirstOrDefault()
                        ??
                        a.Media
                            .Where(am => am.Media.Type == MediaType.Anime_screen)
                            .OrderBy(am => am.MediaId)
                            .Select(am => am.Media.Url)
                            .FirstOrDefault()
                })
                .ToListAsync(ct);
        }

        // CHARACTERS
        if (all || type == SearchType.Characters)
        {
            var charactersQuery = _db.Characters
                .Where(c => EF.Functions.Like(c.Name, $"%{query}%"))
                .AsQueryable();

            // Dodajemy do total count
            result.TotalResults += await charactersQuery.CountAsync(ct);

            result.Characters = await charactersQuery
                .OrderBy(c => c.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new CharacterSearchDTO
                {
                    Id = c.Id,
                    Name = c.Name,

                    ImageUrl =
                        c.Media
                            .Where(m =>
                                m.Media.Type == MediaType.Character_poster ||
                                m.Media.Type == MediaType.Character_poster_inactive
                            )
                            .Select(m => m.Media.Url)
                            .FirstOrDefault()
                        ??
                        c.Media
                            .Where(m => m.Media.Type == MediaType.Character_screen)
                            .Select(m => m.Media.Url)
                            .FirstOrDefault()
                })
                .ToListAsync(ct);
        }

        // USERS
        if (all || type == SearchType.Users)
        {
            var queryFiltered = _db.Users
                .Where(u => EF.Functions.Like(u.Username, $"%{query}%"));

            result.Users = await queryFiltered
                .OrderBy(u => u.Username)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UserSearchDTO
                {
                    Id = u.Id,
                    Username = u.Username,
                    AvatarUrl = u.AvatarUrl
                })
                .ToListAsync(ct);

            result.TotalResults += await queryFiltered.CountAsync(ct);
        }

        if (all || type == SearchType.Studios)
        {
            var studiosQuery = _db.Studios
                .Where(s => EF.Functions.Like(s.Name, $"%{query}%"));

            result.TotalResults += await studiosQuery.CountAsync(ct);

            result.Studios = await studiosQuery
                .OrderBy(s => s.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(s => new StudioSearchDTO
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    AnimeCount = s.AnimeStudios.Count,
                    LogoUrl = s.Media
                        .Where(m => m.Media.Type == MediaType.Studio_poster)
                        .Select(m => m.Media.Url)
                        .FirstOrDefault() // jeśli brak, będzie null
                })
                .ToListAsync(ct);
        }

        // AUTHORS
        if (all || type == SearchType.Authors)
        {
            var authorsQuery = _db.Authors
                .Where(a => EF.Functions.Like(a.Name, $"%{query}%"))
                .AsQueryable();

            // Count
            result.TotalResults += await authorsQuery.CountAsync(ct);

            result.Authors = await authorsQuery
                .OrderBy(a => a.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new AuthorSearchDTO
                {
                    Id = a.Id,
                    FullName = a.Name,
                    BirthDate = null,  // bo model author go nie posiada

                    WorksCount = a.AnimeAuthors.Count,

                    ImageUrl =
                        a.Media
                            .Where(m => m.Media.Type == MediaType.Author_poster)
                            .Select(m => m.Media.Url)
                            .FirstOrDefault()
                        ??
                        a.Media
                            .Select(m => m.Media.Url)
                            .FirstOrDefault()
                })
                .ToListAsync(ct);
        }

        // NEWS
        if (all || type == SearchType.News)
        {
            var newsQuery = _db.News
                .Where(n => EF.Functions.Like(n.Title, $"%{query}%"));

            result.TotalResults += await newsQuery.CountAsync(ct);

            result.News = await newsQuery
                .OrderByDescending(n => n.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(n => new NewsSearchDTO
                {
                    Id = n.Id,
                    Title = n.Title,
                    CreatedAt = n.CreatedAt,
                    AuthorName = n.Author.Username
                })
                .ToListAsync(ct);
        }

        // CLUBS
        if (all || type == SearchType.Clubs)
        {
            var clubsQuery = _db.Clubs
                .Include(c => c.Members)
                .Include(c => c.Media)
                    .ThenInclude(cm => cm.Media)
                .Where(c => EF.Functions.Like(c.Name, $"%{query}%"));

            result.TotalResults += await clubsQuery.CountAsync(ct);

            result.Clubs = await clubsQuery
                .OrderBy(c => c.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new ClubSearchDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    MembersCount = c.Members.Count,
                    CreatedAt = c.CreatedAt,
                    ImageUrl = c.Media
                        .OrderBy(cm => cm.MediaId)
                        .Select(cm => cm.Media.Url)
                        .FirstOrDefault()
                })
                .ToListAsync(ct);
            }

        return result;
    }
}