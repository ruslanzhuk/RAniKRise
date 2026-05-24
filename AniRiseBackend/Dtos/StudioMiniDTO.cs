namespace AniRiseBackend.Dtos;

public class StudioMiniDTO
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string? PosterUrl { get; set; }
    public int AnimeCount { get; set; }
}
