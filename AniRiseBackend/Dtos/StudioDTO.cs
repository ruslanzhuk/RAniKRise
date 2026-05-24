using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos;


public class StudioDTO
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public List<MediaDTO> Media { get; set; } = new();
    public List<StudioAnimeDTO> Animes { get; set; } = new();
}

public class StudioAnimeDTO
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
}