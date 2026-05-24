public class NewsDetailsDTO
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public string ContentHtml { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public string AuthorName { get; set; } = null!;

    public int Likes { get; set; }
    public int Dislikes { get; set; }

    public ReactionType? UserReaction { get; set; }
}