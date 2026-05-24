using AniRiseBackend.Data;
using AniRiseBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace AniRiseBackend.Services;

public class ClubPostReactionService
{
    private readonly AppDbContext _db;

    public ClubPostReactionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<bool> ReactAsync(long postId, Guid userId, ReactionType reaction)
    {
        var post = await _db.ClubPosts
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == postId);

        if (post == null)
            return false;

        var isMember = await _db.UserClubs
            .AnyAsync(uc => uc.ClubId == post.ClubId && uc.UserId == userId);

        if (!isMember)
            return false;

        var existing = await _db.ClubPostReactions
            .FirstOrDefaultAsync(r => r.PostId == postId && r.UserId == userId);

        if (existing != null)
        {
            if (existing.Reaction == reaction)
                _db.ClubPostReactions.Remove(existing);
            else
                existing.Reaction = reaction;
        }
        else
        {
            _db.ClubPostReactions.Add(new ClubPostReaction
            {
                PostId = postId,
                UserId = userId,
                Reaction = reaction
            });
        }

        await _db.SaveChangesAsync();
        return true;
    }
}
