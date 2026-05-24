using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos.Admin;

public class AnimeAuthorInputDTO
{
    public long AuthorId { get; set; }
    public AuthorRole Role { get; set; }
}
