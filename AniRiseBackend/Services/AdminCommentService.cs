using AniRiseBackend.Dtos.Admin;
using AniRiseBackend.Models;
using AniRiseBackend.Data;
using Microsoft.EntityFrameworkCore;

namespace AniRiseBackend.Services;

public interface IAdminCommentService
{
    Task<List<AdminCommentDTO>> GetCommentsAsync(
        CommentTargetType? targetType = null,
        long? targetEntityId = null,
        Guid? targetUserId = null
    );

    Task<AdminCommentDTO?> GetCommentByIdAsync(long commentId);
    Task DeleteCommentAsync(long commentId);
    Task BlockUserAsync(Guid userId);
}

public class AdminCommentService : IAdminCommentService
{
    private readonly AppDbContext _db;
    private readonly NotificationService _notifications;

    public AdminCommentService(AppDbContext db, NotificationService notifications)
    {
        _db = db;
        _notifications = notifications;
    }

    public async Task<List<AdminCommentDTO>> GetCommentsAsync(
        CommentTargetType? targetType = null,
        long? targetEntityId = null,
        Guid? targetUserId = null)
    {
        IQueryable<Comment> query = _db.Comments
            .Include(c => c.User)
            .Include(c => c.Replies)
                .ThenInclude(r => r.User);

        if (targetType.HasValue)
            query = query.Where(c => c.TargetType == targetType.Value);

        if (targetEntityId.HasValue)
            query = query.Where(c => c.TargetEntityId == targetEntityId.Value);

        if (targetUserId.HasValue)
            query = query.Where(c => c.TargetUserId == targetUserId.Value);

        var commentList = await query
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();


        var animeIds = commentList
            .Where(c => c.TargetType == CommentTargetType.Anime && c.TargetEntityId.HasValue)
            .Select(c => c.TargetEntityId!.Value)
            .ToList();

        var animeTitles = await _db.Animes
            .Where(a => animeIds.Contains(a.Id))
            .ToDictionaryAsync(a => a.Id, a => a.Title);

        var postIds = commentList
            .Where(c => c.TargetType == CommentTargetType.Post && c.TargetEntityId.HasValue)
            .Select(c => c.TargetEntityId!.Value)
            .ToList();

        var postContents = await _db.Posts
            .Where(p => postIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id, p => p.Content);

        var clubPostIds = commentList
            .Where(c => c.TargetType == CommentTargetType.ClubPost && c.TargetEntityId.HasValue)
            .Select(c => c.TargetEntityId!.Value)
            .ToList();

        var clubPostContents = await _db.ClubPosts
            .Where(cp => clubPostIds.Contains(cp.Id))
            .ToDictionaryAsync(cp => cp.Id, cp => cp.Content);

        var userIds = commentList
            .Where(c => c.TargetType == CommentTargetType.User && c.TargetUserId.HasValue)
            .Select(c => c.TargetUserId!.Value)
            .ToList();

        var userNames = await _db.Users
            .Where(u => userIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => u.Username);


        var lookup = commentList.ToLookup(c => c.ParentCommentId);

        List<AdminCommentDTO> BuildTree(long? parentId)
        {
            return lookup[parentId].Select(c =>
            {
                var dto = new AdminCommentDTO
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    TargetType = c.TargetType,
                    TargetEntityId = c.TargetEntityId,
                    TargetUserId = c.TargetUserId,
                    UserId = c.User.Id,
                    Username = c.User.Username,
                    Email = c.User.Email,
                    IsBlocked = c.User.IsBlocked,
                    ParentCommentId = c.ParentCommentId,
                    Replies = BuildTree(c.Id)
                };

                dto.TargetTitle = c.TargetType switch
                {
                    CommentTargetType.Anime => c.TargetEntityId.HasValue && animeTitles.ContainsKey(c.TargetEntityId.Value)
                        ? animeTitles[c.TargetEntityId.Value]
                        : null,
                    CommentTargetType.Post => c.TargetEntityId.HasValue && postContents.ContainsKey(c.TargetEntityId.Value)
                        ? postContents[c.TargetEntityId.Value]
                        : null,
                    CommentTargetType.ClubPost => c.TargetEntityId.HasValue && clubPostContents.ContainsKey(c.TargetEntityId.Value)
                        ? clubPostContents[c.TargetEntityId.Value]
                        : null,
                    CommentTargetType.User => c.TargetUserId.HasValue && userNames.ContainsKey(c.TargetUserId.Value)
                        ? userNames[c.TargetUserId.Value]
                        : null,
                    _ => null
                };

                return dto;
            }).ToList();
        }

        return BuildTree(null)
            .OrderByDescending(c => c.CreatedAt)
            .ToList();
    }


    public async Task<AdminCommentDTO?> GetCommentByIdAsync(long commentId)
    {
        var comment = await _db.Comments
            .Include(c => c.User)
            .Include(c => c.Replies)
                .ThenInclude(r => r.User)
            .FirstOrDefaultAsync(c => c.Id == commentId);

        if (comment == null) return null;

        string? targetTitle = comment.TargetType switch
        {
            CommentTargetType.Anime => comment.TargetEntityId.HasValue
                ? await _db.Animes.Where(a => a.Id == comment.TargetEntityId.Value).Select(a => a.Title).FirstOrDefaultAsync()
                : null,
            CommentTargetType.Post => comment.TargetEntityId.HasValue
                ? await _db.Posts.Where(p => p.Id == comment.TargetEntityId.Value).Select(p => p.Content).FirstOrDefaultAsync()
                : null,
            CommentTargetType.ClubPost => comment.TargetEntityId.HasValue
                ? await _db.ClubPosts.Where(cp => cp.Id == comment.TargetEntityId.Value).Select(cp => cp.Content).FirstOrDefaultAsync()
                : null,
            CommentTargetType.User => comment.TargetUserId.HasValue
                ? await _db.Users.Where(u => u.Id == comment.TargetUserId.Value).Select(u => u.Username).FirstOrDefaultAsync()
                : null,
            _ => null
        };

        AdminCommentDTO BuildTree(Comment c)
        {
            return new AdminCommentDTO
            {
                Id = c.Id,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                TargetType = c.TargetType,
                TargetEntityId = c.TargetEntityId,
                TargetUserId = c.TargetUserId,
                UserId = c.User.Id,
                Username = c.User.Username,
                Email = c.User.Email,
                IsBlocked = c.User.IsBlocked,
                ParentCommentId = c.ParentCommentId,
                Replies = c.Replies.Select(BuildTree).ToList(),
                TargetTitle = targetTitle
            };
        }

        return BuildTree(comment);
    }

    public async Task DeleteCommentAsync(long commentId)
    {
        var comment = await _db.Comments.FindAsync(commentId);
        if (comment == null) return;

        _db.Comments.Remove(comment);
        await _db.SaveChangesAsync();
    }

    public async Task BlockUserAsync(Guid userId)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null || user.IsBlocked) return;

        user.IsBlocked = true;
        await _db.SaveChangesAsync();

        await _notifications.CreateAsync(
            userId,
            NotificationType.AccountBlocked,
            "Your account has been blocked by the administration due to a violation of the platform rules. Please contact support for more information."
        );
    }
}
