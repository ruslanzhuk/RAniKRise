using AniRiseBackend.Data;
using AniRiseBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace AniRiseBackend.Services;

public class FriendshipService
{
    private readonly AppDbContext _db;
    private readonly NotificationService _notificationService;

    public FriendshipService(AppDbContext db, NotificationService notificationService)
    {
        _db = db;
        _notificationService = notificationService;
    }

    public async Task<bool> SendRequestAsync(Guid requesterId, Guid addresseeId)
    {
        if (requesterId == addresseeId)
            return false;

        var exists = await _db.Friendships.AnyAsync(f =>
            (f.RequesterId == requesterId && f.AddresseeId == addresseeId) ||
            (f.RequesterId == addresseeId && f.AddresseeId == requesterId));

        if (exists)
            return false;

        var friendship = new Friendship
        {
            RequesterId = requesterId,
            AddresseeId = addresseeId
        };

        _db.Friendships.Add(friendship);
        await _db.SaveChangesAsync();

        await _notificationService.CreateAsync(
            addresseeId,
            NotificationType.FriendRequest,
            "You have received a friend request",
            requesterId,
            friendship.Id
        );

        return true;
    }

    public async Task<bool> RespondAsync(long friendshipId, Guid userId, bool accept)
    {
        var friendship = await _db.Friendships
            .Include(f => f.Requester)
            .Include(f => f.Addressee)
            .FirstOrDefaultAsync(f => f.Id == friendshipId);

        if (friendship == null || friendship.AddresseeId != userId)
            return false;

        friendship.Status = accept ? FriendStatus.Accepted : FriendStatus.Rejected;
        await _db.SaveChangesAsync();

        if (accept)
        {
            var addresseeName = friendship.Addressee?.Username ?? "User";

            await _notificationService.CreateAsync(
                friendship.RequesterId,
                NotificationType.FriendAccepted,
                $"{addresseeName} accepted your friend request",
                userId,
                friendship.Id
            );
        }

        return true;
    }

    public async Task<List<User>> GetFriendsAsync(Guid userId)
    {
        return await _db.Friendships
            .Where(f =>
                f.Status == FriendStatus.Accepted &&
                (f.RequesterId == userId || f.AddresseeId == userId))
            .Select(f => f.RequesterId == userId ? f.Addressee : f.Requester)
            .ToListAsync();
    }

    public async Task<List<Friendship>> GetPendingAsync(Guid userId)
    {
        return await _db.Friendships
            .Where(f => f.AddresseeId == userId && f.Status == FriendStatus.Pending)
            .Include(f => f.Requester)
            .ToListAsync();
    }

    public async Task<string> GetFriendshipStatusAsync(Guid me, Guid other)
    {
        if (me == other) return "self";

        var f = await _db.Friendships.FirstOrDefaultAsync(x =>
            (x.RequesterId == me && x.AddresseeId == other) ||
            (x.RequesterId == other && x.AddresseeId == me));

        if (f == null) return "none";
        if (f.Status == FriendStatus.Accepted) return "friends";
        if (f.Status == FriendStatus.Blocked) return "blocked";

        return f.RequesterId == me ? "outgoing" : "incoming";
    }

    public async Task<List<FriendPreviewDto>> GetFriendPreviewAsync(Guid userId, int take = 4)
    {
        return await _db.Friendships
            .Where(f =>
                f.Status == FriendStatus.Accepted &&
                (f.RequesterId == userId || f.AddresseeId == userId))
            .Select(f => f.RequesterId == userId ? f.Addressee : f.Requester)
            .Take(take)
            .Select(u => new FriendPreviewDto(u.Id, u.Username, u.AvatarUrl))
            .ToListAsync();
    }

}
