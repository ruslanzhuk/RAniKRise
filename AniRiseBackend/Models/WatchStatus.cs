using System.ComponentModel.DataAnnotations.Schema;
namespace AniRiseBackend.Models;

public enum WatchStatusEnum
{
    Watching,
    Completed,
    Dropped,
    PlanToWatch,
    OnHold
}


[Table("WatchStatuses")]
public class WatchStatus
{
    public long Id { get; set; }
    public WatchStatusEnum StatusName { get; set; }

    public ICollection<UserAnimeStatus> UserAnimeStatuses { get; set; } = new List<UserAnimeStatus>();
}