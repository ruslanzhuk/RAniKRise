using AniRiseBackend.Models;

namespace AniRiseBackend.Contracts
{
    public record CreateAnimeRequest(
        string Title,
        string Description,
        float Rating,
        AnimeType Type,
        AnimeStatus Status,
        List<long>? GenreIds,
        List<long>? StudioIds,
        List<long>? AuthorIds
    );
}