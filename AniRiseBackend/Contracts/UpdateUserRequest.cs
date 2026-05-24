using AniRiseBackend.Models;

namespace AniRiseBackend.Contracts;

public class UpdateUserRequest
{
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime? BirthDate { get; set; }
    public Gender? Gender { get; set; }
    public AccountVisibility? Visibility { get; set; }
    public string? ThemePreference { get; set; }
}