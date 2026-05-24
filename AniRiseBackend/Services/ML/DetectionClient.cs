using System.Net.Http.Headers;
using AniRiseBackend.Data;
using AniRiseBackend.Dtos.ML;
using AniRiseBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace AniRiseBackend.Services.ML;

public class DetectionClient : IDetectionClient
{
    private readonly HttpClient _httpClient;
    private readonly AppDbContext _dbContext;

    public DetectionClient(HttpClient httpClient, AppDbContext dbContext)
    {
        _httpClient = httpClient;
        _dbContext = dbContext;
    }

    public async Task<List<CharacterCardDTO>> DetectAndResolveAsync(IFormFile image)
    {
        using var content = new MultipartFormDataContent();
        var streamContent = new StreamContent(image.OpenReadStream());
        streamContent.Headers.ContentType = new MediaTypeHeaderValue(image.ContentType);
        content.Add(streamContent, "image", image.FileName);

        var response = await _httpClient.PostAsync("/detect/summary", content);
        response.EnsureSuccessStatusCode();

        var detection = await response.Content.ReadFromJsonAsync<DetectionSummaryResponseDTO>()
            ?? throw new Exception("Empty detection response");

        var result = new List<CharacterCardDTO>();

        for (int i = 0; i < detection.Class_Names.Count; i++)
        {
            string className = detection.Class_Names[i];
            float confidence = detection.Confidence[i];

            var parts = className.Split('_', StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length < 2)
                continue;

            string characterRaw = parts[1];

            string normalizedName = NormalizeCharacterName(characterRaw);

            var character = await _dbContext.Characters
                .Include(c => c.Media)
                    .ThenInclude(cm => cm.Media)
                .FirstOrDefaultAsync(c =>
                    c.Name.ToLower() == normalizedName.ToLower()
                );


            if (character == null)
                continue;

            string? posterUrl = character.Media
                .Select(cm => cm.Media)
                .FirstOrDefault(m => m.Type == MediaType.Character_poster)?.Url
                ?? character.Media
                    .Select(cm => cm.Media)
                    .FirstOrDefault(m => m.Type == MediaType.Character_screen)?.Url;

            result.Add(new CharacterCardDTO
            {
                Id = character.Id,
                MalId = character.MalId,
                Name = character.Name,
                PosterUrl = posterUrl,
                Confidence = confidence
            });
        }

        return result;
    }

    // private string NormalizeCharacterName(string raw)
    // {
    //     if (string.IsNullOrWhiteSpace(raw))
    //         return raw;

    //     if (raw.Contains('-'))
    //     {
    //         var parts = raw.Split('-', StringSplitOptions.RemoveEmptyEntries);
    //         if (parts.Length == 2)
    //         {
    //             // "obito-uchiha" -> "Uchiha, Obito"
    //             return $"{Capitalize(parts[1])}, {Capitalize(parts[0])}";
    //         }
    //         else
    //         {
    //             return $"{Capitalize(parts[1])}, {Capitalize(parts[0])}";
    //         }
    //     }
    //     else
    //     {
    //         return Capitalize(raw);
    //     }
    // }
    private string NormalizeCharacterName(string raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
            return raw;

        if (raw.Contains('-'))
        {
            var parts = raw.Split('-', StringSplitOptions.RemoveEmptyEntries);

            if (parts.Length >= 2)
            {
                string firstName = ApplyNameOverride(parts[0]);
                string lastName = Capitalize(parts[1]);

                return $"{lastName}, {firstName}";
            }
        }

        return ApplyNameOverride(raw);
    }

    private static readonly Dictionary<string, string> CharacterNameOverrides =
        new(StringComparer.OrdinalIgnoreCase)
    {
        { "kyojuro", "Kyoujurou" },
        { "senjuro", "Senjurou" },
        { "shinjuro", "Shinjurou" },
    };

    private string ApplyNameOverride(string namePart)
    {
        if (CharacterNameOverrides.TryGetValue(namePart, out var mapped))
        {
            return mapped;
        }

        return Capitalize(namePart);
    }

    private string Capitalize(string s)
    {
        if (string.IsNullOrWhiteSpace(s)) return s;
        return char.ToUpper(s[0]) + s.Substring(1).ToLower();
    }
}
