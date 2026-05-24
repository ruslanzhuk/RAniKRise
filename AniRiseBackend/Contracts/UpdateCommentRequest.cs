using AniRiseBackend.Models;

namespace AniRiseBackend.Contracts;

public class UpdateCommentRequest
{
    public string Content { get; set; } = null!;
}