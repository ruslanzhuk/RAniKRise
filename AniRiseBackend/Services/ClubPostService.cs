using AniRiseBackend.Data;
using AniRiseBackend.Dtos;
using AniRiseBackend.Models;
using Microsoft.EntityFrameworkCore;
using AniRiseBackend.Contracts;

namespace AniRiseBackend.Services;

public class ClubPostService
{
    private readonly AppDbContext _db;
    private readonly CloudinaryService _cloudinaryService;

    public ClubPostService(AppDbContext db, CloudinaryService cloudinaryService)
    {
        _db = db;
        _cloudinaryService = cloudinaryService;
    }

    public async Task<List<ClubPostDTO>> GetByClubAsync(long clubId, Guid? userId, int offset = 0, int limit = 20)
    {
        var posts = await _db.ClubPosts
            .Where(p => p.ClubId == clubId)
            .OrderByDescending(p => p.CreatedAt)
            .Skip(offset)
            .Take(limit)
            .Include(p => p.Author)
            .Include(p => p.Reactions)
            .Include(p => p.Media)
                .ThenInclude(pm => pm.Media)
            .ToListAsync();

        var result = new List<ClubPostDTO>();

        foreach (var post in posts)
        {
            var commentsCount = await _db.Comments
                .Where(c => c.TargetType == CommentTargetType.ClubPost && c.TargetEntityId == post.Id && c.ParentCommentId == null)
                .CountAsync();

            var mediaUrls = post.Media?
                .Where(pm => pm.Media != null)
                .Select(pm => pm.Media!.Url)
                .ToList() ?? new List<string>();

            var dto = new ClubPostDTO
            {
                Id = post.Id,
                ClubId = post.ClubId,
                AuthorUsername = post.Author?.Username ?? "Unknown",
                Content = post.Content,
                CreatedAt = post.CreatedAt,
                Likes = post.Reactions?.Count(r => r.Reaction == ReactionType.Like) ?? 0,
                Dislikes = post.Reactions?.Count(r => r.Reaction == ReactionType.Dislike) ?? 0,
                UserReaction = userId != null
                    ? post.Reactions?.FirstOrDefault(r => r.UserId == userId)?.Reaction is ReactionType r ? (int)r : null
                    : null,
                CommentsCount = commentsCount,
                MediaUrls = mediaUrls
            };

            result.Add(dto);
        }

        return result;
    }

    public async Task<ClubPostDTO?> GetByIdAsync(long postId, Guid? userId)
    {
        var post = await _db.ClubPosts
            .Include(p => p.Author)
            .Include(p => p.Reactions)
            .Include(p => p.Media)
                .ThenInclude(pm => pm.Media)
            .FirstOrDefaultAsync(p => p.Id == postId);

        if (post == null)
            return null;

        var commentsCount = await _db.Comments
            .Where(c =>
                c.TargetType == CommentTargetType.ClubPost &&
                c.TargetEntityId == post.Id &&
                c.ParentCommentId == null)
            .CountAsync();

        return new ClubPostDTO
        {
            Id = post.Id,
            ClubId = post.ClubId,
            AuthorUsername = post.Author.Username,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            Likes = post.Reactions.Count(r => r.Reaction == ReactionType.Like),
            Dislikes = post.Reactions.Count(r => r.Reaction == ReactionType.Dislike),
            UserReaction = userId != null
                ? post.Reactions.FirstOrDefault(r => r.UserId == userId)?.Reaction is ReactionType r
                    ? (int)r
                    : null
                : null,
            CommentsCount = commentsCount,
            MediaUrls = post.Media.Select(m => m.Media.Url).ToList()
        };
    }

    public async Task<ClubPostDTO?> CreateAsync(long clubId, Guid userId, ClubPostCreateRequest request)
    {
        var club = await _db.Clubs.FirstOrDefaultAsync(c => c.Id == clubId);
        if (club == null) return null;

        var post = new ClubPost
        {
            ClubId = clubId,
            AuthorId = userId,
            Content = request.Content
        };

        _db.ClubPosts.Add(post);
        await _db.SaveChangesAsync();

        var authorUsername = await _db.Users
            .Where(u => u.Id == userId)
            .Select(u => u.Username)
            .FirstAsync();

        return new ClubPostDTO
        {
            Id = post.Id,
            ClubId = post.ClubId,
            AuthorUsername = authorUsername,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            Likes = 0,
            Dislikes = 0,
            CommentsCount = 0,
            MediaUrls = post.Media.Select(m => m.Media.Url).ToList()
        };
    }

    public async Task<ClubPostDTO?> UpdateAsync(long postId, Guid userId, ClubPostUpdateRequest request)
    {
        var post = await _db.ClubPosts
            .Include(p => p.Club)
            .Include(p => p.Media)
            .Include(p => p.Author)
            .FirstOrDefaultAsync(p => p.Id == postId);

        if (post == null || post.Club.AdminId != userId)
            return null;

        post.Content = request.Content;

        await _db.SaveChangesAsync();

        return new ClubPostDTO
        {
            Id = post.Id,
            ClubId = post.ClubId,
            AuthorUsername = post.Author.Username,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            MediaUrls = post.Media.Select(m => m.Media.Url).ToList()
        };
    }

    public async Task<bool> DeleteAsync(long postId, Guid userId)
    {
        var post = await _db.ClubPosts
            .Include(p => p.Club)
            .FirstOrDefaultAsync(p => p.Id == postId);

        if (post == null || post.Club.AdminId != userId)
            return false;

        // Delete associated reactions
        var reactions = _db.ClubPostReactions.Where(r => r.PostId == postId);
        _db.ClubPostReactions.RemoveRange(reactions);

        // Delete associated media links
        var mediaLinks = _db.ClubPostMedias.Where(m => m.ClubPostId == postId);
        _db.ClubPostMedias.RemoveRange(mediaLinks);

        _db.ClubPosts.Remove(post);
        await _db.SaveChangesAsync();

        return true;
    }
}
