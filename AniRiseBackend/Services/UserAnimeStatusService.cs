using AniRiseBackend.Models;
using AniRiseBackend.Contracts;
using AniRiseBackend.Data;
using Microsoft.EntityFrameworkCore;

using AniRiseBackend.Dtos;


namespace AniRiseBackend.Services;

public interface IUserAnimeStatusService
{
    Task<UserAnimeStatus?> GetStatusAsync(Guid userId, long animeId);
    Task<UserAnimeStatus> SetStatusAsync(Guid userId, long animeId, WatchStatusEnum status);
    Task<bool> RemoveStatusAsync(Guid userId, long animeId);
    Task<IEnumerable<UserAnimeStatus>> GetUserStatusesAsync(Guid userId);
    Task<UserStatsDTO> GetUserAnimeStatsAsync(string username);

    Task<RatingDTO?> GetRatingAsync(Guid userId, long animeId);
    Task<RatingDTO> SetRatingAsync(Guid userId, long animeId, int score);
    Task<RatingDTO?> RemoveRatingAsync(Guid userId, long animeId);
}



public class UserAnimeStatusService : IUserAnimeStatusService
{
    private readonly AppDbContext _db;

    public UserAnimeStatusService(AppDbContext db)
    {
        _db = db;
    }

    // --- STATUS ---
    public async Task<UserAnimeStatus?> GetStatusAsync(Guid userId, long animeId)
    {
        return await _db.UserAnimeStatuses
            .Include(uas => uas.WatchStatus)
            .FirstOrDefaultAsync(uas => uas.UserId == userId && uas.AnimeId == animeId);
    }

    public async Task<UserAnimeStatus> SetStatusAsync(Guid userId, long animeId, WatchStatusEnum statusEnum)
    {
        var watchStatus = await _db.WatchStatuses.FirstOrDefaultAsync(ws => ws.StatusName == statusEnum);
        if (watchStatus == null)
            throw new KeyNotFoundException("WatchStatus not found");

        var existing = await _db.UserAnimeStatuses
            .FirstOrDefaultAsync(uas => uas.UserId == userId && uas.AnimeId == animeId);

        if (existing != null)
        {
            if (existing.StatusId == watchStatus.Id)
            {
                _db.UserAnimeStatuses.Remove(existing);
            }
            else
            {
                existing.StatusId = watchStatus.Id;
                existing.WatchStatus = watchStatus;
            }
        }
        else
        {
            existing = new UserAnimeStatus
            {
                UserId = userId,
                AnimeId = animeId,
                StatusId = watchStatus.Id,
                WatchStatus = watchStatus
            };
            await _db.UserAnimeStatuses.AddAsync(existing);
        }

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> RemoveStatusAsync(Guid userId, long animeId)
    {
        var existing = await _db.UserAnimeStatuses.FirstOrDefaultAsync(uas => uas.UserId == userId && uas.AnimeId == animeId);
        if (existing == null) return false;

        _db.UserAnimeStatuses.Remove(existing);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<UserAnimeStatus>> GetUserStatusesAsync(Guid userId)
    {
        return await _db.UserAnimeStatuses
            .Include(uas => uas.Anime)
            .Include(uas => uas.WatchStatus)
            .Where(uas => uas.UserId == userId)
            .ToListAsync();
    }

    // --- STATS ---
    public async Task<UserStatsDTO> GetUserAnimeStatsAsync(string username)
    {
        var user = await _db.Users
            .Where(u => u.Username == username)
            .Select(u => new
            {
                u.Id,
                Statuses = u.UserAnimeStatuses
                    .GroupBy(s => s.WatchStatus.StatusName)
                    .Select(g => new { Status = g.Key, Count = g.Count() })
            })
            .FirstOrDefaultAsync();

        if (user == null) throw new KeyNotFoundException("User not found");

        var dto = new UserStatsDTO();
        foreach (var s in user.Statuses)
        {
            switch (s.Status)
            {
                case WatchStatusEnum.Watching: dto.TotalWatching = s.Count; break;
                case WatchStatusEnum.Completed: dto.TotalCompleted = s.Count; break;
                case WatchStatusEnum.Dropped: dto.TotalDropped = s.Count; break;
                case WatchStatusEnum.PlanToWatch: dto.TotalPlanned = s.Count; break;
                case WatchStatusEnum.OnHold: dto.TotalOnHold = s.Count; break;
            }
        }
        dto.TotalAnime = dto.TotalWatching + dto.TotalCompleted + dto.TotalDropped + dto.TotalPlanned + dto.TotalOnHold;
        return dto;
    }

    // --- RATING ---
    public async Task<RatingDTO?> GetRatingAsync(Guid userId, long animeId)
    {
        var rating = await _db.Ratings.FirstOrDefaultAsync(r => r.UserId == userId && r.AnimeId == animeId);
        if (rating == null) return null;

        var anime = await _db.Animes.FirstAsync(a => a.Id == animeId);

        return new RatingDTO
        {
            Score = rating.Score,
            AniRiseRating = anime.AniRiseAverageScore,
            AniRiseVotes = anime.AniRiseScoredBy
        };
    }


    public async Task<RatingDTO> SetRatingAsync(Guid userId, long animeId, int score)
    {
        if (score < 1 || score > 10) throw new ArgumentOutOfRangeException(nameof(score));

        var existing = await _db.Ratings.FirstOrDefaultAsync(r => r.UserId == userId && r.AnimeId == animeId);

        if (existing != null)
        {
            existing.Score = score;
        }
        else
        {
            existing = new Rating { UserId = userId, AnimeId = animeId, Score = score };
            await _db.Ratings.AddAsync(existing);
        }

        await _db.SaveChangesAsync();

        // 🔹 перерахунок середньої
        await RecalculateAnimeRatingAsync(animeId, CancellationToken.None);
        await _db.SaveChangesAsync();

        var anime = await _db.Animes.FirstAsync(a => a.Id == animeId);

        return new RatingDTO
        {
            Score = score,
            AniRiseRating = anime.AniRiseAverageScore,
            AniRiseVotes = anime.AniRiseScoredBy
        };
    }

    public async Task<RatingDTO?> RemoveRatingAsync(Guid userId, long animeId)
    {
        var existing = await _db.Ratings.FirstOrDefaultAsync(r => r.UserId == userId && r.AnimeId == animeId);
        if (existing == null) return null;

        _db.Ratings.Remove(existing);
        await _db.SaveChangesAsync();

        await RecalculateAnimeRatingAsync(animeId, CancellationToken.None);
        await _db.SaveChangesAsync();

        var anime = await _db.Animes.FirstAsync(a => a.Id == animeId);

        return new RatingDTO
        {
            Score = 0,
            AniRiseRating = anime.AniRiseAverageScore,
            AniRiseVotes = anime.AniRiseScoredBy
        };
    }

    private async Task RecalculateAnimeRatingAsync(long animeId, CancellationToken ct)
    {
        var ratings = await _db.Ratings
            .Where(r => r.AnimeId == animeId)
            .ToListAsync(ct);

        var anime = await _db.Animes.FirstOrDefaultAsync(a => a.Id == animeId, ct);
        if (anime == null)
            return;

        if (!ratings.Any())
        {
            anime.AniRiseAverageScore = 0;
            anime.AniRiseScoredBy = 0;
        }
        else
        {
            anime.AniRiseScoredBy = ratings.Count;
            anime.AniRiseAverageScore = MathF.Round(
                (float)ratings.Average(r => r.Score),
                2
            );
        }
    }
}