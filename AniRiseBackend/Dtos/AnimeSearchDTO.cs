namespace AniRiseBackend.Dtos;

public class AnimeSearchDTO
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public string? PosterUrl { get; set; }
    public float Rating { get; set; }
}