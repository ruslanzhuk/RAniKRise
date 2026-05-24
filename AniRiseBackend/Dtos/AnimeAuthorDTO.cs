using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos;

public record AnimeAuthorDTO(
    long Id,
    string Name,
    AuthorRole Role
);
