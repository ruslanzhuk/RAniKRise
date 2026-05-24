namespace AniRiseBackend.Dtos;

public class ClubDetailDTO
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }

    public string AdminName { get; set; } = null!;
    public string? ImageUrl { get; set; }

    public ClubMembershipDTO Membership { get; set; } = new();
    public int MembersCount { get; set; }

    public List<string> Members { get; set; } = new();
}
