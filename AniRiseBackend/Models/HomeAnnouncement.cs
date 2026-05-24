using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AniRiseBackend.Models;

[Table("HomeAnnouncements")]
public class HomeAnnouncement
{
    [Key]
    public long Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = null!;

    public string ContentHtml { get; set; } = null!;

    public long? MediaId { get; set; }
    public Media? Media { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
