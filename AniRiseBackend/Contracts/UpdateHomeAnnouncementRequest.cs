namespace AniRiseBackend.Contracts;

public class UpdateHomeAnnouncementRequest
{
    public string? Title { get; set; }
    public string? ContentHtml { get; set; }
    public IFormFile? Media { get; set; }
    public bool? IsActive { get; set; }
}
