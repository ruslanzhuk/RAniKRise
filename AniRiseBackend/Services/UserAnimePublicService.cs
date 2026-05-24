using AniRiseBackend.Data;
using AniRiseBackend.Dtos;
using AniRiseBackend.Models;
using Microsoft.EntityFrameworkCore;


namespace AniRiseBackend.Services;
public interface IUserAnimePublicService
{
    Task<UserStatsDTO> GetUserStatsAsync(string username);
    Task<IEnumerable<UserAnimeListItemDTO>> GetUserAnimeListAsync(
        string username,
        WatchStatusEnum? status = null
    );
}

public class UserAnimePublicService : IUserAnimePublicService
{
    private readonly AppDbContext _db;

    public UserAnimePublicService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<UserStatsDTO> GetUserStatsAsync(string username)
    {
        var user = await _db.Users
            .Where(u => u.Username == username)
            .Select(u => new
            {
                u.Id,
                Statuses = u.UserAnimeStatuses
                    .GroupBy(s => s.WatchStatus.StatusName)
                    .Select(g => new
                    {
                        Status = g.Key,
                        Count = g.Count()
                    })
            })
            .FirstOrDefaultAsync();

        if (user == null)
            throw new KeyNotFoundException("User not found");

        var dto = new UserStatsDTO();

        foreach (var s in user.Statuses)
        {
            switch (s.Status)
            {
                case WatchStatusEnum.Watching:
                    dto.TotalWatching = s.Count;
                    break;
                case WatchStatusEnum.Completed:
                    dto.TotalCompleted = s.Count;
                    break;
                case WatchStatusEnum.Dropped:
                    dto.TotalDropped = s.Count;
                    break;
                case WatchStatusEnum.PlanToWatch:
                    dto.TotalPlanned = s.Count;
                    break;
                case WatchStatusEnum.OnHold:
                    dto.TotalOnHold = s.Count;
                    break;
            }
        }

        dto.TotalAnime =
            dto.TotalWatching +
            dto.TotalCompleted +
            dto.TotalDropped +
            dto.TotalPlanned +
            dto.TotalOnHold;

        return dto;
    }

    public async Task<IEnumerable<UserAnimeListItemDTO>> GetUserAnimeListAsync(
        string username,
        WatchStatusEnum? status = null
    )
    {
        var query = _db.UserAnimeStatuses
            .Where(uas => uas.User.Username == username);

        if (status.HasValue)
        {
            query = query.Where(uas => uas.WatchStatus.StatusName == status.Value);
        }

        return await query
            .Select(uas => new UserAnimeListItemDTO
            {
                AnimeId = uas.Anime.Id,
                Title = uas.Anime.Title,
                Status = uas.WatchStatus.StatusName,

                Rating = _db.Ratings
                    .Where(r => r.UserId == uas.UserId && r.AnimeId == uas.AnimeId)
                    .Select(r => (int?)r.Score)
                    .FirstOrDefault(),

                CoverImage = uas.Anime.Media
                    .Where(am =>
                        am.Media.Type == MediaType.Anime_poster ||
                        am.Media.Type == MediaType.Anime_poster_inactive
                    )
                    .OrderBy(am => am.Media.Type == MediaType.Anime_poster ? 0 : 1)
                    .Select(am => am.Media.Url)
                    .FirstOrDefault()
            })
            .AsNoTracking()
            .ToListAsync();
    }
}
