public class ClubPostDTO
{
    public long Id { get; set; }
    public long ClubId { get; set; }

    public string AuthorUsername { get; set; } = null!;
    public string Content { get; set; } = null!;
    public DateTime CreatedAt { get; set; }

    public int Likes { get; set; }
    public int Dislikes { get; set; }

    public int? UserReaction { get; set; }

    public int CommentsCount { get; set; }
    public List<string> MediaUrls { get; set; } = new();
}
