using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos;

public class AuthorDTO
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Bio { get; set; }

    public List<MediaDTO> Media { get; set; } = new();

    public List<AuthorAnimeDTO> Animes { get; set; } = new();
}

public class AuthorAnimeDTO
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public List<string> Roles { get; set; } = new();
    public string? PosterUrl { get; set; }
}