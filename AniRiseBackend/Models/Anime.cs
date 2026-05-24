using System.ComponentModel.DataAnnotations.Schema;
namespace AniRiseBackend.Models;

public enum AnimeStatus
{
    Ongoing,
    Finished,
    Upcoming,
    Canceled
}

public enum AnimeType
{
    TV,
    Movie,
    OVA,
    ONA,
    Special,
    TVShort,
    Music
}

public enum AnimeAgeRating
{
    G,
    PG,
    PG13,
    R17,
    RPlus
}

[Table("Animes")]
public class Anime
{
    [Key]
    public long Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = null!;

    [MaxLength(255)]
    public string? JapaneseTitle { get; set; }

    [Required]
    public string Description { get; set; } = null!;

    public int Episodes { get; set; }

    [Required]
    public AnimeStatus Status { get; set; } = AnimeStatus.Ongoing;

    [Required]
    public AnimeType Type { get; set; } = AnimeType.TV;

    public float AverageScore { get; set; }
    public int? ScoredBy { get; set; }

    public float AniRiseAverageScore { get; set; }
    public int AniRiseScoredBy { get; set; }


    public int? Rank { get; set; }

    public AnimeAgeRating? AgeRating { get; set; }

    public DateTime ReleaseDate { get; set; }

    public ICollection<AnimeMedia> Media { get; set; } = new List<AnimeMedia>();

    public ICollection<AnimeAuthor> AnimeAuthors { get; set; } = new List<AnimeAuthor>();
    public ICollection<AnimeGenre> AnimeGenres { get; set; } = new List<AnimeGenre>();
    public ICollection<AnimeStudio> AnimeStudios { get; set; } = new List<AnimeStudio>();
    public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<UserAnimeStatus> UserAnimeStatuses { get; set; } = new List<UserAnimeStatus>();
    public ICollection<CollectionAnime> CollectionAnimes { get; set; } = new List<CollectionAnime>();
    public ICollection<AnimeCharacter> AnimeCharacters { get; set; } = new List<AnimeCharacter>();

    public Anime() { }

    public Anime(
        string title,
        string description,
        float averageScore,
        AnimeType type,
        AnimeStatus status,
        IEnumerable<AnimeGenre> genres,
        IEnumerable<AnimeStudio>? studios = null,
        IEnumerable<AnimeAuthor>? authors = null
    ) {
        Title = title;
        Description = description;
        AverageScore = averageScore;
        Type = type;
        Status = status;
        AnimeGenres = genres.ToList();
        AnimeStudios = studios?.ToList() ?? new List<AnimeStudio>();
        AnimeAuthors = authors?.ToList() ?? new List<AnimeAuthor>();
    }
}

