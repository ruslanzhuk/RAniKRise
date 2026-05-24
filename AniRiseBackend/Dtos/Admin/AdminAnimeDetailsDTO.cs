using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos.Admin;

public class AdminAnimeDetailsDTO
{
    public long Id { get; set; }

    public string Title { get; set; } = null!;
    public string? JapaneseTitle { get; set; }
    public string Description { get; set; } = null!;
    public int Episodes { get; set; }

    public AnimeStatus Status { get; set; }
    public AnimeType Type { get; set; }
    public AnimeAgeRating? AgeRating { get; set; }

    public float AverageScore { get; set; }
    public int? ScoredBy { get; set; }
    public int? Rank { get; set; }

    public DateTime ReleaseDate { get; set; }

    public List<long> GenreIds { get; set; } = new();
    public List<long> StudioIds { get; set; } = new();

    public List<AnimeAuthorInputDTO> Authors { get; set; } = new();
    public List<AnimeCharacterInputDTO> Characters { get; set; } = new();
}
