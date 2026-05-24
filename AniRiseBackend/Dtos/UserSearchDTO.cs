namespace AniRiseBackend.Dtos;

public class UserSearchDTO
{
    public Guid Id { get; set; }
    public string Username { get; set; } = default!;
    public string? AvatarUrl { get; set; }
}