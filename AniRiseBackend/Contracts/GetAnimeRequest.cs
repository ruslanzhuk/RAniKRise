namespace AniRiseBackend.Contracts
{
    public record GetAnimeRequest(string? Search, string? Genre, string? Type, string? Status, string? Rating, string? Order, string? Sort, int? Page, int? Limit, int? Offset);
}