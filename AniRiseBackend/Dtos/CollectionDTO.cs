namespace AniRiseBackend.Contracts;

public class CollectionDTO
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public List<AnimeShortDTO> Animes { get; set; } = new();
}
