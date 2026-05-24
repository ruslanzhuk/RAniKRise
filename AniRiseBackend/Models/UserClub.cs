using System.ComponentModel.DataAnnotations.Schema;

namespace AniRiseBackend.Models;

[Table("UserClubs")]
public class UserClub
{
    public long ClubId { get; set; }
    public Club Club { get; set; } = null!;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}
