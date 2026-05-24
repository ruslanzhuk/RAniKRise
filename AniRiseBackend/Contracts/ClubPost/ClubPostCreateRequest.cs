public class ClubPostCreateRequest
{
    [Required]
    [MaxLength(2500)]
    public string Content { get; set; } = null!;
}