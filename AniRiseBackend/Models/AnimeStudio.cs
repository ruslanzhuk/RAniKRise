namespace AniRiseBackend.Models;

public class AnimeStudio
{
    public long AnimeId { get; set; }
    public Anime Anime { get; set; } = null!;

    public long StudioId { get; set; }
    public Studio Studio { get; set; } = null!;
}