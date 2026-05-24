namespace AniRiseBackend.Dtos;

public class NewsSearchDTO
{
    public long Id { get; set; }
    public string Title { get; set; } = default!;
    public string AuthorName { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}