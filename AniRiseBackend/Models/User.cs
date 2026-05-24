using System.ComponentModel.DataAnnotations.Schema;
namespace AniRiseBackend.Models;

public enum UserRole
{
    User,
    Moderator,
    Admin
}

public enum Gender
{
    Male,
    Female
}

public enum AccountVisibility
{
    Public,
    Private
}


[Table("Users")]
public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(120)]
    public string Username { get; set; } = null!;

    [Required, MaxLength(255), EmailAddress]
    public string Email { get; set; } = null!;

    public bool IsBlocked { get; set; } = false;


    [Required]
    public bool IsEmailConfirmed { get; set; } = false;

    public string? EmailConfirmationToken { get; set; }
    public DateTime? EmailConfirmationTokenExpires { get; set; }

    public string? PendingEmail { get; set; }
    public string? OldEmailToken { get; set; }
    public string? NewEmailToken { get; set; }
    public DateTime? EmailChangeTokenExpires { get; set; }

    [Required]
    [MaxLength(200)]
    public string Password { get; set; } = null!;

    public string? PasswordResetToken { get; set; }
    public DateTime? PasswordResetTokenExpires { get; set; }

    [MaxLength(255)]
    public string? AvatarUrl { get; set; }

    public DateTime? BirthDate { get; set; } 

    public Gender? Gender { get; set; }

    [Required]
    public DateTime JoinedOn { get; set; } = DateTime.UtcNow;

    [Required]
    public UserRole Role { get; set; } = UserRole.User;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public AccountVisibility Visibility { get; set; } = AccountVisibility.Public;

    public string ThemePreference { get; set; } = "dark";


    public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Collection> Collections { get; set; } = new List<Collection>();
    public ICollection<UserAnimeStatus> UserAnimeStatuses { get; set; } = new List<UserAnimeStatus>();
    public ICollection<Post> Posts { get; set; } = new List<Post>();
    public ICollection<UserClub> UserClubs { get; set; } = new List<UserClub>();

    public ICollection<Friendship> SentFriendRequests { get; set; } = new List<Friendship>();
    public ICollection<Friendship> ReceivedFriendRequests { get; set; } = new List<Friendship>();
    public ICollection<Notification> Notifications { get; set; }
    = new List<Notification>();
}