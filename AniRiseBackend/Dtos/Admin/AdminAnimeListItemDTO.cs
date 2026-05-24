using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos.Admin;

public record AdminAnimeListItemDTO(
    long Id,
    string Title,
    string? JapaneseTitle,
    AnimeType Type,
    AnimeStatus Status,
    AnimeAgeRating? AgeRating,
    float AverageScore,
    int Episodes,
    int? Rank,
    DateTime ReleaseDate,
    int GenresCount,
    int StudiosCount,
    int AuthorsCount
);
