using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AniRiseBackend.Models;

[Table("NewsReactions")]
public class NewsReaction
{
    [Key]
    public long Id { get; set; }

    [Required]
    public long NewsId { get; set; }
    public News News { get; set; } = null!;

    [Required]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    [Required]
    public ReactionType Type { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
