using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AniRiseBackend.Models;

public enum NotificationType
{
    FriendRequest,
    FriendAccepted,
    System,
    Warning,
    AccountBlocked
}


public enum NotificationStatus
{
    New,
    Read
}

[Table("Notifications")]
public class Notification
{
    [Key]
    public long Id { get; set; }

    [Required]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid? SenderId { get; set; }
    public User? Sender { get; set; }

    [Required]
    public NotificationType Type { get; set; }

    [Required]
    public NotificationStatus Status { get; set; } = NotificationStatus.New;

    [MaxLength(500)]
    public string Message { get; set; } = null!;

    public long? ReferenceId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
