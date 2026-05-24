using System.Linq.Expressions;
using AniRiseBackend.Contracts;
using AniRiseBackend.Data;
using AniRiseBackend.Dtos;
using AniRiseBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AniRiseBackend.Services;

public class AnimeImportService
{
    private readonly HttpClient _httpClient;
    private readonly AppDbContext _db;

    public AnimeImportService(HttpClient httpClient, AppDbContext db)
    {
        _httpClient = httpClient;
        _db = db;
    }

    private async Task<T?> GetJsonWithRetry<T>(string url, int maxRetries = 5)
    {
        int retries = 0;

        while (true)
        {
            try
            {
                var response = await _httpClient.GetAsync(url);

                if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                {
                    retries++;
                    Console.WriteLine($"429 Too Many Requests. Wait 1 sec. (attempt {retries}/{maxRetries})...");
                    if (retries > maxRetries)
                        throw new Exception($"Number of attempts exceeded ({maxRetries}) for {url}");

                    await Task.Delay(1000); // wait 1 second and try again
                    continue;
                }

                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<T>();
            }
            catch (HttpRequestException ex)
            {
                retries++;
                Console.WriteLine($"HttpRequestException (attempt {retries}/{maxRetries}): {ex.Message}");
                if (retries > maxRetries)
                    throw; // if there are too many attempts, we pass the error on

                await Task.Delay(1000);
            }
        }
    }

    private AnimeStatus ParseStatus(string? status)
    {
        if (string.IsNullOrEmpty(status)) return AnimeStatus.Upcoming;

        return status.ToLower() switch
        {
            "finished airing" => AnimeStatus.Finished,
            "currently airing" => AnimeStatus.Ongoing,
            "not yet aired" => AnimeStatus.Upcoming,
            "cancelled" => AnimeStatus.Canceled,
            _ => AnimeStatus.Upcoming
        };
    }

    private AnimeType ParseType(string? type)
    {
        if (string.IsNullOrEmpty(type)) return AnimeType.TV;

        return type.ToLower() switch
        {
            "tv" => AnimeType.TV,
            "movie" => AnimeType.Movie,
            "ova" => AnimeType.OVA,
            "ona" => AnimeType.ONA,
            "special" => AnimeType.Special,
            "music" => AnimeType.Music,
            "tv special" => AnimeType.Special,
            "tv short" => AnimeType.TVShort,
            _ => AnimeType.TV
        };
    }

    private static Dictionary<string, string> ParseBio(string? about)
    {
        var bio = new Dictionary<string, string>();

        if (string.IsNullOrWhiteSpace(about))
            return bio;

        var lines = about.Split('\n', StringSplitOptions.RemoveEmptyEntries);

        int descCounter = 1;

        foreach (var line in lines)
        {
            var parts = line.Split(':', 2); // maximum 2 parts
            if (parts.Length == 2)
            {
                var key = parts[0].Trim();
                var value = parts[1].Trim();
                if (!bio.ContainsKey(key))
                    bio[key] = value;
            }
            else
            {
                // if there is no colon → we consider it simply as text
                bio[$"Description{(descCounter > 1 ? $"_{descCounter}" : "")}"] = line.Trim();
                descCounter++;
            }
        }

        return bio;
    }

    private static CharacterRole ParseCharacterRole(string? role)
    {
        return role?.Trim().ToLower() switch
        {
            "main" => CharacterRole.Main,
            _ => CharacterRole.Supporting
        };
    }

    private AuthorRole ParseAuthorRole(string role)
    {
        if (string.IsNullOrWhiteSpace(role))
            return AuthorRole.Supporting;

        var normalized = role
            .Trim()
            .Replace(" ", "")
            .Replace("2nd", "Second")
            .Replace("ADR", "Adr");

        return Enum.TryParse<AuthorRole>(normalized, ignoreCase: true, out var parsed)
            ? parsed
            : AuthorRole.Supporting;
    }

    public async Task<AnimeImportDto?> ImportAnimeByIdAsync(long id)
    {
        var existing = await _db.Animes
            .Include(a => a.AnimeGenres).ThenInclude(ag => ag.Genre)
            .Include(a => a.AnimeStudios).ThenInclude(asd => asd.Studio)
            .Include(a => a.AnimeAuthors).ThenInclude(aa => aa.Author)
            .Include(a => a.AnimeCharacters).ThenInclude(ac => ac.Character)
            .Include(a => a.Media).ThenInclude(am => am.Media)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (existing != null)
            throw new InvalidOperationException($"Anime with ID {id} already exists in the database.");
    
        // 1. Main data
        var fullUrl = $"https://api.jikan.moe/v4/anime/{id}/full";
        var fullResponse = await GetJsonWithRetry<JikanAnimeResponse>(fullUrl);
        if (fullResponse?.Data == null) return null;

        var data = fullResponse.Data;

        var anime = new Anime
        {
            Id = data.MalId,
            Title = data.Title,
            JapaneseTitle = data.TitleJapanese,
            Description = data.Synopsis ?? "No description",
            Episodes = data.Episodes ?? 0,
            Status = ParseStatus(data.Status),
            Type = ParseType(data.Type),
            AverageScore = data.Score ?? 0,
            Rank = data.Rank ?? null,
            ReleaseDate = data.Aired?.From ?? DateTime.MinValue,
            ScoredBy = data.ScoredBy ?? 0
        };

        // 2. Genres
        foreach (var genreData in data.Genres)
        {
            var genre = await _db.Genres.FirstOrDefaultAsync(g => g.Name == genreData.Name)
                    ?? new Genre { Name = genreData.Name };
            
            if (genre.Id == 0)
                _db.Genres.Add(genre);

            anime.AnimeGenres.Add(new AnimeGenre { Anime = anime, Genre = genre });
        }

        // 3. Studious
        foreach (var studioData in data.Studios)
        {
            var studio = await _db.Studios.FirstOrDefaultAsync(s => s.Name == studioData.Name)
                    ?? new Studio { Name = studioData.Name };

            if (studio.Id == 0)
                _db.Studios.Add(studio);
            
            anime.AnimeStudios.Add(new AnimeStudio { Anime = anime, Studio = studio });
        }

        // 4. Authors staff
        var staffUrl = $"https://api.jikan.moe/v4/anime/{id}/staff";
        var staffResponse = await GetJsonWithRetry<JikanStaffResponse>(staffUrl);
        foreach (var staff in staffResponse?.Data ?? new())
        {
            var author = await _db.Authors.FirstOrDefaultAsync(a => a.Name == staff.Person.Name)
                ?? new Author { Name = staff.Person.Name };

            if (author.Id == 0)
                _db.Authors.Add(author);

            foreach (var role in staff.Positions)
            {
                var parsedRole = ParseAuthorRole(role);
                anime.AnimeAuthors.Add(new AnimeAuthor
                {
                    Anime = anime,
                    Author = author,
                    Role = parsedRole
                });
            }

            // Authors photo
            var authorImg = staff.Person.Images?.Jpg?.ImageUrl;
            if (!string.IsNullOrEmpty(authorImg))
            {
                var media = new Media { Type = MediaType.Author_poster, Url = authorImg };
                if (media.Id == 0)
                    _db.Medias.Add(media);
                
                author.Media.Add(new AuthorMedia { Author = author, Media = media });
            }
        }

        // 5. Characters
        var charUrl = $"https://api.jikan.moe/v4/anime/{id}/characters";
        var charResponse = await GetJsonWithRetry<JikanCharactersResponse>(charUrl);
        foreach (var charData in charResponse?.Data ?? new())
        {
            var charFullUrl = $"https://api.jikan.moe/v4/characters/{charData.Character.MalId}/full";
            var charFullResponse = await GetJsonWithRetry<JikanCharacterFullResponse>(charFullUrl);

            var character = await _db.Characters
                .FirstOrDefaultAsync(c => c.MalId == charData.Character.MalId)
                ?? new Character
                {
                    MalId = charData.Character.MalId,
                    Name = charData.Character.Name,
                    Bio = ParseBio(charFullResponse?.Data?.About)
                };

            if (character.Id == 0)
                _db.Characters.Add(character);
            

            anime.AnimeCharacters.Add(new AnimeCharacter
            {
                Anime = anime,
                Character = character,
                Role = ParseCharacterRole(charData.Role)
            });

            // Character image
            var charImg = charData.Character.Images?.Jpg?.ImageUrl;
            if (!string.IsNullOrEmpty(charImg))
            {
                var media = new Media { Type = MediaType.Character_poster, Url = charImg };
                if (media.Id == 0)
                    _db.Medias.Add(media);
                
                character.Media.Add(new CharacterMedia { Character = character, Media = media });
            }
        }

        // Anime poster
        if (!string.IsNullOrEmpty(data.Images?.Jpg?.LargeImageUrl))
        {
            var url = data.Images.Jpg.LargeImageUrl;
            var media = new Media { Type = MediaType.Anime_poster, Url = url };
            if (media.Id == 0)
                _db.Medias.Add(media);

            anime.Media.Add(new AnimeMedia { Anime = anime, Media = media });
        }

        // 6. Studios media (placeholders)
        foreach (var studioData in data.Studios)
        {
            var studio = await _db.Studios.FirstOrDefaultAsync(s => s.Name == studioData.Name);
            if (studio != null && !studio.Media.Any())
            {
                var placeholder = $"https://via.placeholder.com/300x450/222222/FFFFFF?text={Uri.EscapeDataString(studioData.Name)}";
                var media = new Media { Type = MediaType.Studio_poster, Url = placeholder };
                if (media.Id == 0)
                    _db.Medias.Add(media);
                
                studio.Media.Add(new StudioMedia { Studio = studio, Media = media });
            }
        }


        // 7. Save
        _db.Animes.Add(anime);
        await _db.SaveChangesAsync();

        return new AnimeImportDto
        {
            Id = anime.Id,
            Title = anime.Title,
            JapaneseTitle = anime.JapaneseTitle,
            Description = anime.Description,
            Episodes = anime.Episodes,
            Status = anime.Status,
            Type = anime.Type,
            AverageScore = anime.AverageScore,
            Rank = anime.Rank,
            ReleaseDate = anime.ReleaseDate,
            ScoredBy = anime.ScoredBy,
            Genres = anime.AnimeGenres
                .Select(ag => ag.Genre.Name ?? "Unknown")
                .ToList(),
            Studios = anime.AnimeStudios
                .Select(ast => ast.Studio.Name ?? "Unknown")
                .ToList(),
            Authors = anime.AnimeAuthors
                .GroupBy(aa => aa.Author.Name ?? "Unknown")
                .Select(g => new AuthorImportDto
                {
                    Name = g.Key,
                    Roles = g
                        .Select(a => a.Role.ToString() ?? "Unknown")
                        .Distinct()
                        .ToList()
                }).ToList(),
            Characters = anime.AnimeCharacters
                .Select(ac => new CharacterImportDto
                {
                    MalId = ac.Character.MalId,
                    Name = ac.Character.Name ?? "Unknown",
                    Role = ac.Role
                }).ToList(),
            Media = anime.Media
                .Select(am => new MediaImportDto
                {
                    Id = am.Media.Id,
                    Type = am.Media.Type,
                    Url = am.Media.Url
                }).ToList()
        };
    }

    public async Task<JikanAnimeData?> GetAnimeByIdAsync(long id)
    {
        var url = $"https://api.jikan.moe/v4/anime/{id}/full";
        var response = await GetJsonWithRetry<JikanAnimeResponse>(url);
        return response?.Data;
    }

    public async Task<AnimePreviewDto?> PreviewAnimeByIdAsync(long id)
    {
        var fullUrl = $"https://api.jikan.moe/v4/anime/{id}/full";
        var fullResponse = await GetJsonWithRetry<JikanAnimeResponse>(fullUrl);
        if (fullResponse?.Data == null) return null;

        var data = fullResponse.Data;

        var dto = new AnimePreviewDto
        {
            Id = data.MalId,
            Title = data.Title,
            JapaneseTitle = data.TitleJapanese,
            Description = data.Synopsis ?? "No description",
            Episodes = data.Episodes ?? 0,
            Status = ParseStatus(data.Status),
            Type = ParseType(data.Type),
            AverageScore = data.Score ?? 0,
            Rank = data.Rank,
            ReleaseDate = data.Aired?.From ?? DateTime.MinValue,
            PosterUrl = data.Images?.Jpg?.ImageUrl
        };

        dto.Genres.AddRange(data.Genres.Select(g => g.Name));
        dto.Studios.AddRange(data.Studios.Select(s => s.Name));

        var staffUrl = $"https://api.jikan.moe/v4/anime/{id}/staff";
        var staffResponse = await GetJsonWithRetry<JikanStaffResponse>(staffUrl);
        dto.Authors.AddRange(staffResponse?.Data.SelectMany(st => st.Positions.Select(p => $"{st.Person.Name} ({p})")) ?? new List<string>());

        var charUrl = $"https://api.jikan.moe/v4/anime/{id}/characters";
        var charResponse = await GetJsonWithRetry<JikanCharactersResponse>(charUrl);
        dto.Characters.AddRange(charResponse?.Data.Select(c => $"{c.Character.Name} ({c.Role})") ?? new List<string>());

        return dto;
    }

    private async Task UpdateGenres(Anime anime, List<JikanGenre> newGenres)
    {
        // Delete removed genres
        var toRemove = anime.AnimeGenres
            .Where(ag => !newGenres.Any(g => g.Name == ag.Genre.Name))
            .ToList();

        if (toRemove.Any())
            _db.AnimeGenres.RemoveRange(toRemove);

        // Add new genres
        foreach (var genreData in newGenres)
        {
            if (!anime.AnimeGenres.Any(ag => ag.Genre.Name == genreData.Name))
            {
                var genre = await _db.Genres.FirstOrDefaultAsync(g => g.Name == genreData.Name)
                    ?? new Genre { Name = genreData.Name };

                anime.AnimeGenres.Add(new AnimeGenre { Anime = anime, Genre = genre });
            }
        }
    }

    private async Task UpdateStudios(Anime anime, List<JikanStudio> newStudios)
    {
        // Delete removed studios
        var toRemove = anime.AnimeStudios
            .Where(ast => !newStudios.Any(s => s.Name == ast.Studio.Name))
            .ToList();

        if (toRemove.Any())
            _db.AnimeStudios.RemoveRange(toRemove);

        // Add new studios
        foreach (var studioData in newStudios)
        {
            if (!anime.AnimeStudios.Any(ast => ast.Studio.Name == studioData.Name))
            {
                var studio = await _db.Studios.FirstOrDefaultAsync(s => s.Name == studioData.Name)
                    ?? new Studio { Name = studioData.Name };

                anime.AnimeStudios.Add(new AnimeStudio { Anime = anime, Studio = studio });
            }
        }
    }

    private async Task UpdateAuthors(Anime anime, long id)
    {
        var staffUrl = $"https://api.jikan.moe/v4/anime/{id}/staff";
        var staffResponse = await GetJsonWithRetry<JikanStaffResponse>(staffUrl);

        if (staffResponse?.Data == null) return;

        var newStaff = staffResponse.Data;

        var toRemove = anime.AnimeAuthors
            .Where(aa => !newStaff.Any(s => s.Person.Name == aa.Author.Name))
            .ToList();

        if (toRemove.Any())
            _db.AnimeAuthors.RemoveRange(toRemove);

        foreach (var staff in newStaff)
        {
            var author = await _db.Authors
                .Include(a => a.Media)
                .FirstOrDefaultAsync(a => a.Name == staff.Person.Name)
                ?? new Author { Name = staff.Person.Name, Media = new List<AuthorMedia>() };

            author.Media ??= new List<AuthorMedia>();

            foreach (var role in staff.Positions)
            {
                var parsedRole = ParseAuthorRole(role);

                if (!anime.AnimeAuthors.Any(aa => aa.Author.Name == author.Name && aa.Role == parsedRole))
                {
                    anime.AnimeAuthors.Add(new AnimeAuthor
                    {
                        Anime = anime,
                        Author = author,
                        Role = parsedRole
                    });
                }
            }

            var authorImg = staff.Person.Images?.Jpg?.ImageUrl;

            if (!string.IsNullOrEmpty(authorImg))
            {
                var existingActive = author.Media
                    .FirstOrDefault(m => m.Media != null && m.Media.Type == MediaType.Author_poster);

                if (existingActive == null)
                {
                    var newMedia = new Media
                    {
                        Type = MediaType.Author_poster,
                        Url = authorImg
                    };
                    author.Media.Add(new AuthorMedia { Author = author, Media = newMedia });
                }
                else if (existingActive.Media.Url != authorImg)
                {
                    existingActive.Media.Type = MediaType.Author_poster_inactive;

                    var newMedia = new Media
                    {
                        Type = MediaType.Author_poster,
                        Url = authorImg
                    };
                    author.Media.Add(new AuthorMedia { Author = author, Media = newMedia });
                }
            }
        }
    }

    private static bool DictionariesEqual(Dictionary<string, string>? a, Dictionary<string, string>? b)
    {
        if (ReferenceEquals(a, b)) return true;
        if (a == null || b == null) return false;
        if (a.Count != b.Count) return false;

        foreach (var kv in a)
        {
            if (!b.TryGetValue(kv.Key, out var val)) return false;
            if (val != kv.Value) return false;
        }
        return true;
    }

    private async Task UpdateCharacters(Anime anime, long id)
    {
        var charUrl = $"https://api.jikan.moe/v4/anime/{id}/characters";
        var charResponse = await GetJsonWithRetry<JikanCharactersResponse>(charUrl);

        if (charResponse?.Data == null) return;

        var newCharacters = charResponse.Data;

        // 1) Remove AnimeCharacter links that are not present anymore (only relationship)
        var toRemove = anime.AnimeCharacters
            .Where(ac => !newCharacters.Any(c => c.Character.MalId == ac.Character.MalId))
            .ToList();

        if (toRemove.Any())
            _db.AnimeCharacters.RemoveRange(toRemove);

        // 2) Add or update characters
        foreach (var charData in newCharacters)
        {
            // fetch full data (about, etc.)
            var charFullUrl = $"https://api.jikan.moe/v4/characters/{charData.Character.MalId}/full";
            var charFullResponse = await GetJsonWithRetry<JikanCharacterFullResponse>(charFullUrl);

            // try to load existing character including its media collection
            var character = await _db.Characters
                .Include(c => c.Media) // CharacterMedia entries
                    .ThenInclude(cm => cm.Media)
                .FirstOrDefaultAsync(c => c.MalId == charData.Character.MalId);

            // if not found - create new
            if (character == null)
            {
                character = new Character
                {
                    MalId = charData.Character.MalId,
                    Name = charData.Character.Name,
                    Bio = ParseBio(charFullResponse?.Data?.About),
                    Media = new List<CharacterMedia>()
                };
                // don't need to _db.Characters.Add(character) explicitly if you add via relationships later,
                // but it's safe to add here if you prefer
                _db.Characters.Add(character);
            }
            else
            {
                // update name if changed
                if (character.Name != charData.Character.Name)
                    character.Name = charData.Character.Name;

                // update bio if changed and not empty
                var newBio = ParseBio(charFullResponse?.Data?.About);
                if (newBio != null && newBio.Count > 0 && !DictionariesEqual(newBio, character.Bio))
                {
                    character.Bio = newBio;
                }

                character.Media ??= new List<CharacterMedia>();
            }

            // ensure anime-character relationship exists
            if (!anime.AnimeCharacters.Any(ac => ac.Character.MalId == character.MalId))
            {
                anime.AnimeCharacters.Add(new AnimeCharacter
                {
                    Anime = anime,
                    Character = character,
                    Role = ParseCharacterRole(charData.Role)
                });
            }
            else
            {
                // optionally update role if it changed
                var existingRel = anime.AnimeCharacters.First(ac => ac.Character.MalId == character.MalId);
                var newRole = ParseCharacterRole(charData.Role);
                if (existingRel.Role != newRole)
                    existingRel.Role = newRole;
            }

            // 3) Handle character image
            var charImg = charData.Character.Images?.Jpg?.ImageUrl;
            if (!string.IsNullOrEmpty(charImg))
            {
                // character.Media is collection of CharacterMedia (join). We included it above, so it should be tracked.
                var existingActive = character.Media
                    .FirstOrDefault(m => m.Media != null && m.Media.Type == MediaType.Character_poster);

                if (existingActive == null)
                {
                    // no active poster -> add new media + link
                    var newMedia = new Media
                    {
                        Type = MediaType.Character_poster,
                        Url = charImg
                    };
                    _db.Medias.Add(newMedia);
                    character.Media.Add(new CharacterMedia { Character = character, Media = newMedia });
                }
                else if (existingActive.Media.Url != charImg)
                {
                    // different image -> mark old as inactive (switch type) and add new active poster
                    existingActive.Media.Type = MediaType.Character_poster_inactive;

                    var newMedia = new Media
                    {
                        Type = MediaType.Character_poster,
                        Url = charImg
                    };
                    _db.Medias.Add(newMedia);
                    character.Media.Add(new CharacterMedia { Character = character, Media = newMedia });
                }
            }
        }
    }

    private async Task UpdateAnimeMedia(Anime anime, string? posterUrl)
    {
        if (string.IsNullOrEmpty(posterUrl))
            return;

        var existingActive = anime.Media
            .FirstOrDefault(m => m.Media.Type == MediaType.Anime_poster);

        if (existingActive == null)
        {
            var newMedia = new Media
            {
                Type = MediaType.Anime_poster,
                Url = posterUrl
            };
            anime.Media.Add(new AnimeMedia { Anime = anime, Media = newMedia });
            return;
        }

        if (existingActive.Media.Url == posterUrl)
            return;

        existingActive.Media.Type = MediaType.Anime_poster_inactive;

        var newPoster = new Media
        {
            Type = MediaType.Anime_poster,
            Url = posterUrl
        };
        anime.Media.Add(new AnimeMedia { Anime = anime, Media = newPoster });
    }



    public async Task<AnimeImportDto?> SyncAnimeByIdAsync(long id)
    {
        var existingAnime = await _db.Animes
            .Include(a => a.AnimeGenres).ThenInclude(g => g.Genre)
            .Include(a => a.AnimeStudios).ThenInclude(s => s.Studio)
            .Include(a => a.AnimeAuthors).ThenInclude(aa => aa.Author)
            .Include(a => a.AnimeCharacters).ThenInclude(ac => ac.Character)
            .Include(a => a.Media).ThenInclude(am => am.Media)
            .FirstOrDefaultAsync(a => a.Id == id);

        var fullUrl = $"https://api.jikan.moe/v4/anime/{id}/full";
        var fullResponse = await GetJsonWithRetry<JikanAnimeResponse>(fullUrl);
        if (fullResponse?.Data == null) return null;

        var data = fullResponse.Data;

        if (existingAnime == null)
        {
            return await ImportAnimeByIdAsync(id);
        }

        existingAnime.Title = data.Title;
        existingAnime.JapaneseTitle = data.TitleJapanese;
        existingAnime.Description = data.Synopsis ?? existingAnime.Description;
        existingAnime.Episodes = data.Episodes ?? existingAnime.Episodes;
        existingAnime.Status = ParseStatus(data.Status);
        existingAnime.Type = ParseType(data.Type);
        existingAnime.AverageScore = data.Score ?? existingAnime.AverageScore;
        existingAnime.Rank = data.Rank ?? existingAnime.Rank;
        existingAnime.ScoredBy = data.ScoredBy ?? existingAnime.ScoredBy;
        existingAnime.ReleaseDate = data.Aired?.From ?? existingAnime.ReleaseDate;

        await UpdateGenres(existingAnime, data.Genres);
        await UpdateStudios(existingAnime, data.Studios);
        await UpdateCharacters(existingAnime, id);
        await UpdateAuthors(existingAnime, id);
        await UpdateAnimeMedia(existingAnime, data.Images?.Jpg?.LargeImageUrl);

        await _db.SaveChangesAsync();

        return new AnimeImportDto
        {
            Id = existingAnime.Id,
            Title = existingAnime.Title,
            Description = existingAnime.Description,
            Episodes = existingAnime.Episodes,
            Status = existingAnime.Status,
            Type = existingAnime.Type,
            AverageScore = existingAnime.AverageScore,
            Rank = existingAnime.Rank,
            ReleaseDate = existingAnime.ReleaseDate,
            ScoredBy = existingAnime.ScoredBy
        };
    }
}