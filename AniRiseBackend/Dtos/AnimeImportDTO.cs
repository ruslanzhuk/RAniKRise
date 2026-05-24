using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos;

public class AnimeImportDto
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public string? JapaneseTitle { get; set; }
    public string Description { get; set; } = null!;
    public int Episodes { get; set; }
    public AnimeStatus Status { get; set; }
    public AnimeType Type { get; set; }
    public float AverageScore { get; set; }
    public int? Rank { get; set; }

    public int? ScoredBy { get; set; }
    public DateTime ReleaseDate { get; set; }

    public List<string> Genres { get; set; } = new();
    public List<string> Studios { get; set; } = new();
    public List<AuthorImportDto> Authors { get; set; } = new();
    public List<CharacterImportDto> Characters { get; set; } = new();
    public List<MediaImportDto> Media { get; set; } = new();
}

public class AuthorImportDto
{
    public string Name { get; set; } = null!;
    public List<string> Roles { get; set; } = new();
}

public class CharacterImportDto
{
    public long MalId { get; set; }
    public string Name { get; set; } = null!;
    public CharacterRole Role { get; set; }
}

public class MediaImportDto
{
    public long Id { get; set; }
    public MediaType Type { get; set; }
    public string Url { get; set; } = null!;
}