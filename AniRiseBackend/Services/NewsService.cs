using Microsoft.EntityFrameworkCore;
using AniRiseBackend.Data;
using AniRiseBackend.Models;
using Microsoft.EntityFrameworkCore;
using AniRiseBackend.Dtos;
using AniRiseBackend.Contracts;

namespace AniRiseBackend.Services;


public interface INewsService
{
    Task<List<NewsPreviewDTO>> GetAllAsync(CancellationToken ct);
    Task<List<NewsPreviewDTO>> GetByQueryAsync(int limit, int offset, string sortBy, string sortOrder, CancellationToken ct);

    Task<NewsDetailsDTO?> GetByIdAsync(long id, Guid? currentUserId = null, CancellationToken ct = default);

    Task<long> CreateAsync(NewsCreateRequest request, Guid authorId, CancellationToken ct);
    Task<bool> UpdateAsync(long id, NewsUpdateRequest request, CancellationToken ct);
    Task<bool> DeleteAsync(long id, CancellationToken ct);

    Task<bool> AddReactionAsync(long newsId, Guid userId, ReactionType type, CancellationToken ct);
    Task<bool> RemoveReactionAsync(long newsId, Guid userId, CancellationToken ct);
}


public class NewsService : INewsService
{
    private readonly AppDbContext _db;

    public NewsService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<NewsPreviewDTO>> GetAllAsync(CancellationToken ct)
    {
        return await _db.News
            .Include(n => n.Reactions)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NewsPreviewDTO
            {
                Id = n.Id,
                Title = n.Title,
                PreviewContent = n.PreviewContent,
                CreatedAt = n.CreatedAt,
                Likes = n.Reactions.Count(r => r.Type == ReactionType.Like),
                Dislikes = n.Reactions.Count(r => r.Type == ReactionType.Dislike)
            })
            .ToListAsync(ct);
    }

    public async Task<List<NewsPreviewDTO>> GetByQueryAsync(int limit, int offset, string sortBy, string sortOrder, CancellationToken ct)
    {
        var query = _db.News.Include(n => n.Reactions).Include(n => n.Author).AsQueryable();

        // Dynamiczne sortowanie
        query = (sortBy.ToLower(), sortOrder.ToLower()) switch
        {
            ("title", "asc") => query.OrderBy(n => n.Title),
            ("title", "desc") => query.OrderByDescending(n => n.Title),
            ("author", "asc") => query.OrderBy(n => n.Author.Username),
            ("author", "desc") => query.OrderByDescending(n => n.Author.Username),
            ("createdat", "asc") => query.OrderBy(n => n.CreatedAt),
            _ => query.OrderByDescending(n => n.CreatedAt) // domyślnie CreatedAt desc
        };

        var newsList = await query
            .Skip(offset)
            .Take(limit)
            .Select(n => new NewsPreviewDTO
            {
                Id = n.Id,
                Title = n.Title,
                PreviewContent = n.PreviewContent,
                CreatedAt = n.CreatedAt,
                Likes = n.Reactions.Count(r => r.Type == ReactionType.Like),
                Dislikes = n.Reactions.Count(r => r.Type == ReactionType.Dislike),
            })
            .ToListAsync(ct);

        return newsList;
    }

    public async Task<NewsDetailsDTO?> GetByIdAsync(
    long id,
    Guid? currentUserId,
    CancellationToken ct)
    {
        return await _db.News
            .Include(n => n.Author)
            .Include(n => n.Reactions)
            .Where(n => n.Id == id)
            .Select(n => new NewsDetailsDTO
            {
                Id = n.Id,
                Title = n.Title,
                ContentHtml = n.ContentHtml,
                CreatedAt = n.CreatedAt,
                UpdatedAt = n.UpdatedAt,
                AuthorName = n.Author.Username,
                Likes = n.Reactions.Count(r => r.Type == ReactionType.Like),
                Dislikes = n.Reactions.Count(r => r.Type == ReactionType.Dislike),

                UserReaction = currentUserId == null
                    ? null
                    : n.Reactions
                        .Where(r => r.UserId == currentUserId)
                        .Select(r => (ReactionType?)r.Type)
                        .FirstOrDefault()
            })
            .FirstOrDefaultAsync(ct);
    }

    public async Task<long> CreateAsync(NewsCreateRequest request, Guid authorId, CancellationToken ct)
    {
        var news = new News
        {
            Title = request.Title,
            PreviewContent = request.PreviewContent,
            ContentHtml = request.ContentHtml,
            AuthorId = authorId
        };

        _db.News.Add(news);
        await _db.SaveChangesAsync(ct);

        return news.Id;
    }

    public async Task<bool> UpdateAsync(long id, NewsUpdateRequest request, CancellationToken ct)
    {
        var news = await _db.News.FindAsync(id);

        if (news == null) return false;

        if (request.Title != null)
            news.Title = request.Title;

        if (request.PreviewContent != null)
            news.PreviewContent = request.PreviewContent;

        if (request.ContentHtml != null)
            news.ContentHtml = request.ContentHtml;

        news.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteAsync(long id, CancellationToken ct)
    {
        var news = await _db.News.FindAsync(id);
        if (news == null) return false;

        _db.News.Remove(news);
        await _db.SaveChangesAsync(ct);

        return true;
    }

    public async Task<bool> AddReactionAsync(long newsId, Guid userId, ReactionType type, CancellationToken ct)
    {
        var existing = await _db.NewsReactions
            .FirstOrDefaultAsync(r => r.NewsId == newsId && r.UserId == userId, ct);

        if (existing != null)
        {
            existing.Type = type;
        }
        else
        {
            _db.NewsReactions.Add(new NewsReaction
            {
                NewsId = newsId,
                UserId = userId,
                Type = type
            });
        }

        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> RemoveReactionAsync(long newsId, Guid userId, CancellationToken ct)
    {
        var reaction = await _db.NewsReactions
            .FirstOrDefaultAsync(r => r.NewsId == newsId && r.UserId == userId, ct);

        if (reaction == null) return false;

        _db.NewsReactions.Remove(reaction);
        await _db.SaveChangesAsync(ct);

        return true;
    }
}
