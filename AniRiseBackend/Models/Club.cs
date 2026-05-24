using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AniRiseBackend.Models;

[Table("Clubs")]
public class Club
{
    [Key]
    public long Id { get; set; }

    [Required, MaxLength(255)]
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Admin who created the club
    [Required]
    public Guid AdminId { get; set; }
    public User Admin { get; set; } = null!;

    // Members
    public ICollection<UserClub> Members { get; set; } = new List<UserClub>();

    // Posts in the club
    public ICollection<ClubPost> Posts { get; set; } = new List<ClubPost>();

    // Club images/media
    public ICollection<ClubMedia> Media { get; set; } = new List<ClubMedia>();
}
