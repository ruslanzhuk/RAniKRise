using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos;

public class AnimePreviewDto
{
    public long Id { get; set; }
    public string Title { get; set; } = "";
    public string? JapaneseTitle { get; set; } = "";
    public string Description { get; set; } = "";
    public int Episodes { get; set; }
    public AnimeStatus Status { get; set; } = AnimeStatus.Ongoing;
    public AnimeType Type { get; set; } = AnimeType.TV;
    public double AverageScore { get; set; }
    public int? Rank { get; set; }
    public DateTime ReleaseDate { get; set; }
    public List<string> Genres { get; set; } = new();
    public List<string> Studios { get; set; } = new();
    public List<string> Authors { get; set; } = new();
    public List<string> Characters { get; set; } = new();
    public string? PosterUrl { get; set; }
}