using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos;

public class CommentCreateDTO
{
    public CommentTargetType TargetType { get; set; }
    public long TargetId { get; set; }
    public string Content { get; set; } = null!;
}