using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos;

public record AnimeDetailDTO(
    long Id,
    string Title,
    string Description,
    DateTime ReleaseDate,
    float MalRating,
    int? MalScoredBy,
    float AniRiseRating,
    int AniRiseScoredBy,
    AnimeType Type,
    AnimeStatus Status,
    List<string> Genres,
    IReadOnlyList<AnimeStudioDTO> Studios,
    IReadOnlyList<AnimeAuthorDTO> Authors,
    List<string> MediaUrls,
    List<CharacterAnimeDTO> MainCharacters 
);