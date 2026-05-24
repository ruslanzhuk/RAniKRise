using AniRiseBackend.Models;

public class UpdateProfileRequest
{
    public string Username { get; set; } = null!;
    public DateTime? BirthDate { get; set; }
    public Gender? Gender { get; set; }
    public AccountVisibility Visibility { get; set; }
}
