namespace AniRiseBackend.Dtos;

public class StudioSearchDTO
{
    public long Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public int? AnimeCount { get; set; }
}