using System.ComponentModel.DataAnnotations.Schema;
namespace AniRiseBackend.Models;

[Table("Rating")]
public class Rating
{
    public long Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    [Required]
    public long AnimeId { get; set; }

    public Anime Anime { get; set; } = null!;

    [Range(1, 10)]
    public int Score { get; set; }
}