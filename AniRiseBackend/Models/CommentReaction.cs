using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AniRiseBackend.Models;

[Table("CommentReactions")]
public class CommentReaction
{
    [Key]
    public long Id { get; set; }

    [Required]
    public long CommentId { get; set; }
    public Comment Comment { get; set; } = null!;

    [Required]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    [Required]
    public ReactionType Reaction { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
