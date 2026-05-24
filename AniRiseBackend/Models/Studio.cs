namespace AniRiseBackend.Models;

public class Studio
{
    public long Id { get; set; }

    [Required, MaxLength(255)]
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public ICollection<StudioMedia> Media { get; set; } = new List<StudioMedia>();

    public ICollection<AnimeStudio> AnimeStudios { get; set; } = new List<AnimeStudio>();
}