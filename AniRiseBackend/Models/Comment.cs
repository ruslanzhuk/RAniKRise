using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AniRiseBackend.Models;

public enum CommentTargetType
{
    Anime,
    User,
    Post,
    ClubPost
}


public class Comment
{
    [Key]
    public long Id { get; set; }

    [Required]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    [Required]
    public CommentTargetType TargetType { get; set; }

    public long? TargetEntityId { get; set; }

    public Guid? TargetUserId { get; set; }

    [Required]
    [MaxLength(2000)]
    public string Content { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public long? ParentCommentId { get; set; }
    public Comment? ParentComment { get; set; }

    public ICollection<Comment> Replies { get; set; } = new List<Comment>();

    public ICollection<CommentReaction> Reactions { get; set; } = new List<CommentReaction>();
}