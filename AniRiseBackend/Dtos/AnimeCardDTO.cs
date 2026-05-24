using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos;

public class AnimeCardDTO
{
    public long Id { get; set; }
    public string Title { get; set; } = "";
    public string? PosterUrl { get; set; }
    public string ShortDescription { get; set; } = "";
    public AnimeType Type { get; set; }
    public AnimeStatus Status { get; set; }
    public int Episodes { get; set; }
    public int ReleaseYear { get; set; }
    public AnimeAgeRating? AgeRating { get; set; }
    public List<string> Studios { get; set; } = new();
    public List<string> Genres { get; set; } = new();
    public double AverageScore { get; set; }
    public int? ScoredBy { get; set; }
}
