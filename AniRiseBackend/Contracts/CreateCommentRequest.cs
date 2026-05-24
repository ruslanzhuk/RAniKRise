using AniRiseBackend.Models;

namespace AniRiseBackend.Contracts;

public class CreateCommentRequest
{
    public CommentTargetType TargetType { get; set; }

    public long? TargetIdLong { get; set; }

    public Guid? TargetIdGuid { get; set; }

    [Required]
    [MaxLength(2000)]
    public string Content { get; set; } = null!;
    public long? ParentCommentId { get; set; }
}