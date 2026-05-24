using AniRiseBackend.Models;

namespace AniRiseBackend.Contracts.Anime;

public enum AnimeSortBy
{
    Score,
    Popularity,
    Alphabet,
    ReleaseDate
}

public class AnimeSearchRequest
{
    public List<AnimeStatus>? Statuses { get; set; }
    public List<AnimeType>? Types { get; set; }

    // Episode ranges (TV only)
    public bool? ShortTv { get; set; }     // <=16
    public bool? MiddleTv { get; set; }    // 17-28
    public bool? LongTv { get; set; }      // >29

    // Rating score
    public float? MinScore { get; set; }

    // Age rating
    public List<AnimeAgeRating>? AgeRatings { get; set; }

    // Genres
    public List<long>? GenreIds { get; set; }

    // Seasons / years
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }

    // Sorting
    public AnimeSortBy SortBy { get; set; } = AnimeSortBy.Score;
    public bool Desc { get; set; } = true;

    // Pagination
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}