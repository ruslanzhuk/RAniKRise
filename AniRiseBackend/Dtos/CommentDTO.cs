using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos;

public class CommentDTO
{
    public long Id { get; set; }
    public Guid UserId { get; set; }
    public string Username { get; set; } = null!;
    public string Content { get; set; } = null!;
    public CommentTargetType TargetType { get; set; }
    public long? TargetIdLong { get; set; }
    public Guid? TargetIdGuid { get; set; }
    public long? ParentCommentId { get; set; }
    public List<CommentDTO> Replies { get; set; } = new();
    public int Likes { get; set; }
    public int Dislikes { get; set; }
    public int? UserReaction { get; set; }
    public DateTime CreatedAt { get; set; }
}