using AniRiseBackend.Models;
using AniRiseBackend.Dtos;
using AniRiseBackend.Data;
using Microsoft.EntityFrameworkCore;


namespace AniRiseBackend.Services;

public class CharacterService
{
    private readonly AppDbContext _db;

    public CharacterService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<CharacterDTO>> GetAllAsync(
        int page = 1,
        int pageSize = 20,
        string? search = null
    )
    {
        var query = _db.Characters
            .Include(c => c.Media).ThenInclude(cm => cm.Media)
            .Include(c => c.AnimeCharacters).ThenInclude(ac => ac.Anime)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var lower = search.ToLower();
            query = query.Where(c => c.Name.ToLower().Contains(lower));
        }

        return await query
            .OrderBy(c => c.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CharacterDTO
            {
                Id = c.Id,
                MalId = c.MalId,
                Name = c.Name,
                Description = c.Description,
                Bio = c.Bio,
                Media = c.Media.Select(m => new MediaDTO
                {
                    Url = m.Media.Url,
                    Type = m.Media.Type.ToString()
                }).ToList(),
                Animes = c.AnimeCharacters.Select(ac => new CharacterAnimeDTO
                {
                    Id = ac.Anime.Id,
                    Title = ac.Anime.Title,
                    Role = ac.Role.ToString(),
                    PosterUrl = ac.Anime.Media
                        .Select(am => am.Media.Url)
                        .FirstOrDefault()
                }).ToList()
            })
            .ToListAsync();
    }


    public async Task<CharacterDTO?> GetByIdAsync(long id)
    {
        var character = await _db.Characters
            .Include(c => c.Media).ThenInclude(cm => cm.Media)
            .Include(c => c.AnimeCharacters)
                .ThenInclude(ac => ac.Anime)
                    .ThenInclude(a => a.Media)
                        .ThenInclude(am => am.Media)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

        if (character == null)
            return null;

        return new CharacterDTO
        {
            Id = character.Id,
            MalId = character.MalId,
            Name = character.Name,
            Description = character.Description,
            Bio = character.Bio,
            Media = character.Media.Select(m => new MediaDTO
            {
                Url = m.Media.Url,
                Type = m.Media.Type.ToString()
            }).ToList(),
            Animes = character.AnimeCharacters.Select(ac => new CharacterAnimeDTO
            {
                Id = ac.Anime.Id,
                Title = ac.Anime.Title,
                Role = ac.Role.ToString(),
                PosterUrl = ac.Anime.Media
                    .Select(am => am.Media)
                    .Where(m => m != null)
                    .FirstOrDefault(m => m.Type == MediaType.Anime_poster)
                    ?.Url
                    ?? ac.Anime.Media
                        .Select(am => am.Media)
                        .Where(m => m != null)
                        .FirstOrDefault(m => m.Type == MediaType.Anime_screen)
                        ?.Url
            }).ToList()
        };
    }

    public async Task<Dictionary<string, int>> GetAlphabetCountsAsync()
    {
        var characters = await _db.Characters
            .AsNoTracking()
            .Select(c => c.Name)
            .Where(n => !string.IsNullOrWhiteSpace(n))
            .ToListAsync();

        var result = characters
            .GroupBy(n => n.Split(',')[0].Trim()[0].ToString().ToUpper())
            .OrderBy(g => g.Key)
            .ToDictionary(g => g.Key, g => g.Count());

        return result;
    }

    public async Task<IEnumerable<CharacterDTO>> GetByAlphabetLetterAsync(
        string letter,
        int page = 1,
        int pageSize = 20
    )
    {
        var upperLetter = letter.ToUpper();

        var query = _db.Characters
            .Include(c => c.Media).ThenInclude(cm => cm.Media)
            .Include(c => c.AnimeCharacters).ThenInclude(ac => ac.Anime)
            .AsNoTracking()
            .Where(c => !string.IsNullOrEmpty(c.Name))
            .Where(c => EF.Functions.Like(c.Name.TrimStart(), upperLetter + "%"));

        return await query
            .OrderBy(c => c.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CharacterDTO
            {
                Id = c.Id,
                MalId = c.MalId,
                Name = c.Name,
                Description = c.Description,
                Bio = c.Bio,
                Media = c.Media.Select(m => new MediaDTO
                {
                    Url = m.Media.Url,
                    Type = m.Media.Type.ToString()
                }).ToList(),
                Animes = c.AnimeCharacters.Select(ac => new CharacterAnimeDTO
                {
                    Id = ac.Anime.Id,
                    Title = ac.Anime.Title,
                    Role = ac.Role.ToString(),
                    PosterUrl = ac.Anime.Media
                        .Select(am => am.Media.Url)
                        .FirstOrDefault()
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task<(List<CharacterMiniDTO> MainCharacters, List<CharacterMiniDTO> SupportingCharacters)> GetCharactersByAnimeAsync(long animeId)
    {
        var animeCharacters = await _db.AnimeCharacters
            .Where(ac => ac.AnimeId == animeId)
            .Include(ac => ac.Character)
                .ThenInclude(c => c.Media)
                    .ThenInclude(cm => cm.Media)
            .AsNoTracking()
            .ToListAsync();

        var mainCharacters = animeCharacters
            .Where(ac => ac.Role == CharacterRole.Main)
            .Select(ac => new CharacterMiniDTO
            {
                Id = ac.Character.Id,
                Name = ac.Character.Name,
                ImageUrl = ac.Character.Media.FirstOrDefault()?.Media.Url
            })
            .OrderBy(c => c.Name)
            .ToList();

        var supportingCharacters = animeCharacters
            .Where(ac => ac.Role == CharacterRole.Supporting)
            .Select(ac => new CharacterMiniDTO
            {
                Id = ac.Character.Id,
                Name = ac.Character.Name,
                ImageUrl = ac.Character.Media.FirstOrDefault()?.Media.Url
            })
            .OrderBy(c => c.Name)
            .ToList();

        return (mainCharacters, supportingCharacters);
    }
}