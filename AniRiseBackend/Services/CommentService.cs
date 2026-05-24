using AniRiseBackend.Data;
using AniRiseBackend.Models;
using AniRiseBackend.Dtos;
using AniRiseBackend.Contracts;
using Microsoft.EntityFrameworkCore;

namespace AniRiseBackend.Services;

public interface ICommentService
{
    Task<IEnumerable<CommentDTO>> GetCommentsAsync(CommentTargetType targetType, long targetId, Guid? currentUserId = null);
    Task<IEnumerable<CommentDTO>> GetCommentsForUserAsync(Guid targetUserId, Guid? currentUserId = null);
    Task<CommentDTO> CreateCommentAsync(Guid userId, CreateCommentRequest request);
    Task<CommentDTO> UpdateCommentAsync(Guid userId, long id, string content, Guid? currentUserId = null);
    Task<bool> DeleteCommentAsync(Guid userId, long id);
    Task<CommentDTO> ReactCommentAsync(Guid userId, long commentId, int reaction);
}

public class CommentService : ICommentService
{
    private readonly AppDbContext _db;

    public CommentService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<CommentDTO>> GetCommentsAsync(CommentTargetType targetType, long targetId, Guid? currentUserId = null)
    {
        var comments = await _db.Comments
        .Where(c =>
            c.TargetType == targetType &&
            c.TargetEntityId == targetId
        )
        .Include(c => c.User)
        .Include(c => c.Reactions)
        .OrderBy(c => c.CreatedAt)
        .ToListAsync();

        var lookup = comments.ToLookup(c => c.ParentCommentId);

        List<CommentDTO> BuildTree(long? parentId)
        {
            return lookup[parentId]
                .Select(c =>
                {
                    var dto = MapToDTO(c, currentUserId);
                    dto.Replies = BuildTree(c.Id);
                    return dto;
                })
                .ToList();
        }

        return BuildTree(null)
            .OrderByDescending(c => c.CreatedAt);
    }

    public async Task<IEnumerable<CommentDTO>> GetCommentsForUserAsync(Guid targetUserId, Guid? currentUserId = null)
    {
        var comments = await _db.Comments
            .Where(c => c.TargetType == CommentTargetType.User && c.TargetUserId == targetUserId && c.ParentCommentId == null)
            .Include(c => c.User)
            .Include(c => c.Reactions)
            .Include(c => c.Replies)
                .ThenInclude(r => r.User)
            .Include(c => c.Replies)
                .ThenInclude(r => r.Reactions)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return comments.Select(c => MapToDTO(c, currentUserId)).ToList();
    }

    public async Task<CommentDTO> CreateCommentAsync(Guid userId, CreateCommentRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new UnauthorizedAccessException("User not found.");

        if (user.IsBlocked)
            throw new UnauthorizedAccessException(
                "Your account has been blocked. Please contact support to restore access."
            );

        var comment = new Comment
        {
            UserId = userId,
            TargetType = request.TargetType,
            Content = request.Content.Trim(),
            CreatedAt = DateTime.UtcNow,
            ParentCommentId = request.ParentCommentId
        };

        switch (request.TargetType)
        {
            case CommentTargetType.Anime:
            case CommentTargetType.Post:
            case CommentTargetType.ClubPost:
                comment.TargetEntityId = request.TargetIdLong!.Value;
                break;

            case CommentTargetType.User:
                comment.TargetUserId = request.TargetIdGuid!.Value;
                break;

            default:
                throw new ArgumentException("Invalid comment target type.");
        }

        _db.Comments.Add(comment);
        await _db.SaveChangesAsync();

        var fullComment = await _db.Comments
            .Include(c => c.User)
            .Include(c => c.Reactions)
            .Include(c => c.Replies)
            .FirstAsync(c => c.Id == comment.Id);

        return MapToDTO(fullComment, null);
    }

    public async Task<CommentDTO> UpdateCommentAsync(Guid userId, long id, string content, Guid? currentUserId = null)
    {
        var comment = await _db.Comments.FirstOrDefaultAsync(c => c.Id == id);

        if (comment == null) throw new KeyNotFoundException("Comment not found");
        if (comment.UserId != userId) throw new UnauthorizedAccessException("Cannot edit others' comments");

        comment.Content = content.Trim();
        await _db.SaveChangesAsync();

        return MapToDTO(comment, currentUserId);
    }

    public async Task<bool> DeleteCommentAsync(Guid userId, long id)
    {
        var comment = await _db.Comments
            .Include(c => c.Replies)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (comment == null)
            return false;

        var isAuthor = comment.UserId == userId;
        var isProfileOwner =
            comment.TargetType == CommentTargetType.User &&
            comment.TargetUserId == userId;

        if (!isAuthor && !isProfileOwner)
            throw new UnauthorizedAccessException("You are not allowed to delete this comment.");

        _db.Comments.RemoveRange(comment.Replies);
        _db.Comments.Remove(comment);
        await _db.SaveChangesAsync();

        return true;
    }

    private CommentDTO MapToDTO(Comment c, Guid? currentUserId)
    {
        int? userReaction = currentUserId == null
            ? null
            : (int?)c.Reactions?
                .FirstOrDefault(r => r.UserId == currentUserId)
                ?.Reaction;

        return new CommentDTO
        {
            Id = c.Id,
            UserId = c.UserId,
            Username = c.User?.Username ?? "Unknown",
            Content = c.Content,
            TargetType = c.TargetType,
            TargetIdLong = c.TargetEntityId,
            TargetIdGuid = c.TargetUserId,
            ParentCommentId = c.ParentCommentId,

            Replies = c.Replies?
                .Select(r => MapToDTO(r, currentUserId))
                .ToList() ?? new List<CommentDTO>(),

            Likes = c.Reactions?.Count(r => r.Reaction == ReactionType.Like) ?? 0,
            Dislikes = c.Reactions?.Count(r => r.Reaction == ReactionType.Dislike) ?? 0,

            UserReaction = userReaction,
            CreatedAt = c.CreatedAt
        };
    }


    public async Task<CommentDTO> ReactCommentAsync(Guid userId, long commentId, int reaction)
    {
        var comment = await _db.Comments.Include(c => c.Reactions)
            .FirstOrDefaultAsync(c => c.Id == commentId);

        if (comment == null) throw new KeyNotFoundException("Comment not found");

        var existingReaction = comment.Reactions.FirstOrDefault(r => r.UserId == userId);

        if (existingReaction != null)
        {
            if (existingReaction.Reaction == (ReactionType)reaction)
            {
                _db.CommentReactions.Remove(existingReaction); 
            }
            else
            {
                existingReaction.Reaction = (ReactionType)reaction;
            }
        }
        else
        {
            comment.Reactions.Add(new CommentReaction
            {
                UserId = userId,
                Reaction = (ReactionType)reaction
            });
        }

        await _db.SaveChangesAsync();

        return MapToDTO(comment, userId);
    }
}
