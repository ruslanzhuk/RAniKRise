namespace AniRiseBackend.Contracts;

public class CreateHomeAnnouncementRequest
{
    [Required]
    public string Title { get; set; } = null!;

    [Required]
    public string ContentHtml { get; set; } = null!;

    public IFormFile? Media { get; set; }
}