using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AniRiseBackend.Models;

[Table("Posts")]
public class Post
{
    [Key]
    public long Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    [Required]
    [MaxLength(1000)]
    public string Content { get; set; } = null!;

    public ICollection<PostMedia> Media { get; set; } = new List<PostMedia>();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<PostReaction> Reactions { get; set; } = new List<PostReaction>();
}