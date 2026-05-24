using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos.Admin;

public class AdminCommentDTO
{
    public long Id { get; set; }
    public string Content { get; set; } = null!;
    public DateTime CreatedAt { get; set; }

    public CommentTargetType TargetType { get; set; }
    public long? TargetEntityId { get; set; }
    public Guid? TargetUserId { get; set; }

    public string? TargetTitle { get; set; }

    public Guid UserId { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public bool IsBlocked { get; set; }

    public long? ParentCommentId { get; set; }
    public List<AdminCommentDTO> Replies { get; set; } = new();
}

