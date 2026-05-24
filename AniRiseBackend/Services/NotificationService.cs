using AniRiseBackend.Data;
using AniRiseBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace AniRiseBackend.Services;

public class NotificationService
{
    private readonly AppDbContext _db;

    public NotificationService(AppDbContext db)
    {
        _db = db;
    }

    public async Task CreateAsync(
        Guid userId,
        NotificationType type,
        string message,
        Guid? senderId = null,
        long? referenceId = null)
    {
        var notification = new Notification
        {
            UserId = userId,
            SenderId = senderId,
            Type = type,
            Message = message,
            ReferenceId = referenceId
        };

        _db.Notifications.Add(notification);
        await _db.SaveChangesAsync();
    }

    public async Task<List<Notification>> GetAsync(Guid userId)
    {
        return await _db.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> MarkAsReadAsync(long id, Guid userId)
    {
        var n = await _db.Notifications.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
        if (n == null) return false;

        n.Status = NotificationStatus.Read;
        await _db.SaveChangesAsync();
        return true;
    }
}
