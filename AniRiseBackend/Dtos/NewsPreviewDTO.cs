public class NewsPreviewDTO
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public string PreviewContent { get; set; } = null!;
    public DateTime CreatedAt { get; set; }

    public int Likes { get; set; }
    public int Dislikes { get; set; }
}