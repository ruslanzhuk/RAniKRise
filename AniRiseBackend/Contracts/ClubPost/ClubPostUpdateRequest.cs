namespace AniRiseBackend.Contracts;

public class ClubPostUpdateRequest
{
    [Required]
    [MaxLength(2500)]
    public string Content { get; set; } = null!;
}