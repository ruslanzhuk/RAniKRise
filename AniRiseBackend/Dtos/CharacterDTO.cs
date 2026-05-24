using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos;

public class CharacterDTO
{

    public long Id { get; set; }

    public long MalId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public Dictionary<string, string> Bio { get; set; } = new();

    public List<MediaDTO> Media { get; set; } = new();

    public List<CharacterAnimeDTO> Animes { get; set; } = new();
}


public class CharacterAnimeDTO
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string? PosterUrl { get; set; }
}