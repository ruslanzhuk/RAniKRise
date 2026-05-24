using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AniRiseBackend.Models;

[Table("News")]
public class News
{
    [Key]
    public long Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = null!;

    [Required]
    public string PreviewContent { get; set; } = null!;

    [Required]
    public string ContentHtml { get; set; } = null!;

    [Required]
    public Guid AuthorId { get; set; }
    public User Author { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<NewsReaction> Reactions { get; set; } = new List<NewsReaction>();
}
