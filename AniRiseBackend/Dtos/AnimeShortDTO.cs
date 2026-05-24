namespace AniRiseBackend.Contracts;

public class AnimeShortDTO
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public string? ImageUrl { get; set; }
}
