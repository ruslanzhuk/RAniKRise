using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AniRiseBackend.Models;

[Table("PostReactions")]
public class PostReaction
{
    [Key]
    public long Id { get; set; }

    [Required]
    public long PostId { get; set; }
    public Post Post { get; set; } = null!;

    [Required]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    [Required]
    public ReactionType Reaction { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
