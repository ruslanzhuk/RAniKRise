using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos.Admin;

public class AdminProfileDTO
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? AvatarUrl { get; set; }
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? BirthDate { get; set; }
    public Gender? Gender { get; set; }
    public AccountVisibility Visibility { get; set; }
    public string ThemePreference { get; set; } = "dark";
}