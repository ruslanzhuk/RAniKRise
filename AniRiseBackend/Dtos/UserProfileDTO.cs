using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos;

public class UserProfileDTO
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public bool IsBlocked { get; set; }
    public DateTime? BirthDate { get; set; }
    public Gender? Gender { get; set; }
    public UserRole Role { get; set; } = UserRole.User;
    public DateTime CreatedAt { get; set; }
    public DateTime JoinedOn { get; set; }
    public AccountVisibility Visibility { get; set; }
    public string? ThemePreference { get; set; }
}