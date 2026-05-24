public class NewsCreateRequest
{
    [Required]
    public string Title { get; set; } = null!;

    [Required]
    public string PreviewContent { get; set; } = null!;

    [Required]
    public string ContentHtml { get; set; } = null!;
}
