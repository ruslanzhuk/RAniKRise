using AniRiseBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace AniRiseBackend.Data;

public static class DbSeeder
{
    public static void SeedWatchStatuses(AppDbContext context)
    {
        if (!context.WatchStatuses.Any())
        {
            context.WatchStatuses.AddRange(
                new WatchStatus { StatusName = WatchStatusEnum.Watching },
                new WatchStatus { StatusName = WatchStatusEnum.Completed },
                new WatchStatus { StatusName = WatchStatusEnum.Dropped },
                new WatchStatus { StatusName = WatchStatusEnum.PlanToWatch },
                new WatchStatus { StatusName = WatchStatusEnum.OnHold }
            );
            context.SaveChanges();
        }
    }
}