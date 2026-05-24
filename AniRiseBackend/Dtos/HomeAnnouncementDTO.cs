public class HomeAnnouncementDTO
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public string ContentHtml { get; set; } = null!;
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}
