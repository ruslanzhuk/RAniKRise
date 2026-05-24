using AniRiseBackend.Dtos;
using Humanizer;
namespace AniRiseBackend.Dtos;
public class UserStatsDTO
{
    public int TotalAnime { get; set; }
    public int TotalWatching { get; set; }
    public int TotalCompleted { get; set; }
    public int TotalPlanned { get; set; }
    public int TotalDropped { get; set; }
    public int TotalOnHold { get; set; }
    public int? TotalFavorites { get; set; }
}