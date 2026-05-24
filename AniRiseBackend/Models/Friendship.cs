using System.ComponentModel.DataAnnotations.Schema;
namespace AniRiseBackend.Models;

public enum FriendStatus
{
    Pending,
    Accepted,
    Rejected,
    Blocked
}

[Table("Friendships")]
public class Friendship
{
    [Key]
    public long Id { get; set; }

    [Required]
    public Guid RequesterId { get; set; }
    public User Requester { get; set; } = null!;

    [Required]
    public Guid AddresseeId { get; set; }
    public User Addressee { get; set; } = null!;

    [Required]
    public FriendStatus Status { get; set; } = FriendStatus.Pending;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
