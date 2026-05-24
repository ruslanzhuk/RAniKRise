namespace AniRiseBackend.Dtos;

public class PostResponseDTO
{
    public long Id { get; set; }
    public string Content { get; set; } = null!;
    public List<string> MediaUrls { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public PostAuthorDTO Author { get; set; } = null!;
}


public class PostAuthorDTO
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string? AvatarUrl { get; set; }
}