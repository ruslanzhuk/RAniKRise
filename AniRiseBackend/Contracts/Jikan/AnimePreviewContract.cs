namespace AniRiseBackend.Contracts.Jikan;

public class AnimePreviewContract
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public string? PosterUrl { get; set; }
    public string? Type { get; set; }
    public int? Year { get; set; }

    public int? Episodes { get; set; }
    public string? Synopsis { get; set; }
    public List<string> Genres { get; set; } = new();
    public List<string> Studios { get; set; } = new();
    public double? Score { get; set; }
}