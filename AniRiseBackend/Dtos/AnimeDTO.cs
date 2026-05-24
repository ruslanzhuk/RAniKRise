using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos;

public record AnimeDTO(
    long Id,
    string Title,
    string Description,
    DateTime ReleaseDate,
    float Rating,
    float AniRiseRating,
    AnimeType Type,
    AnimeStatus Status,
    List<string> Genres,
    List<string> Studios,
    List<string> Authors
);