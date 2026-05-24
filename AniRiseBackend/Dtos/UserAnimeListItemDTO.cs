using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos;
public class UserAnimeListItemDTO
{
    public long AnimeId { get; set; }
    public string Title { get; set; } = null!;
    public string? CoverImage { get; set; }
    public WatchStatusEnum Status { get; set; }
    public int? Rating { get; set; }
}
