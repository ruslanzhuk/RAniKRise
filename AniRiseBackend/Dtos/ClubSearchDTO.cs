namespace AniRiseBackend.Dtos;

public class ClubSearchDTO
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public int MembersCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
