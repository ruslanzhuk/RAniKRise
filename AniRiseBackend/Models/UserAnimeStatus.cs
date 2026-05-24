using System.ComponentModel.DataAnnotations.Schema;
namespace AniRiseBackend.Models;

[Table("UserAnimeStatuses")]
public class UserAnimeStatus
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public long AnimeId { get; set; }
    public Anime Anime { get; set; } = null!;

    public long StatusId { get; set; }
    public WatchStatus WatchStatus { get; set; } = null!;
}