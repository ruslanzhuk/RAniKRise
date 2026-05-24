using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AniRiseBackend.Models;

[Table("ClubPosts")]
public class ClubPost
{
    [Key]
    public long Id { get; set; }

    [Required]
    public long ClubId { get; set; }
    public Club Club { get; set; } = null!;

    [Required]
    public Guid AuthorId { get; set; }
    public User Author { get; set; } = null!;

    [Required]
    [MaxLength(2000)]
    public string Content { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ClubPostMedia> Media { get; set; } = new List<ClubPostMedia>();
    public ICollection<ClubPostReaction> Reactions { get; set; } = new List<ClubPostReaction>();
}
