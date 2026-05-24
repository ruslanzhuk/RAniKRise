using Microsoft.EntityFrameworkCore;
using AniRiseBackend.Data;
using AniRiseBackend.Models;
using AniRiseBackend.Dtos;
using AniRiseBackend.Contracts;
using AniRiseBackend.Services;

public interface IHomeAnnouncementService
{
    Task<HomeAnnouncementDTO?> GetActiveAsync(CancellationToken ct);

    Task<HomeAnnouncementDTO?> GetByIdAsync(long id, CancellationToken ct);

    Task<long> CreateAsync(CreateHomeAnnouncementRequest dto, CancellationToken ct);
    Task UpdateAsync(long id, UpdateHomeAnnouncementRequest dto, CancellationToken ct);
    Task DeactivateAsync(long id, CancellationToken ct);
}


public class HomeAnnouncementService : IHomeAnnouncementService
{
    private readonly AppDbContext _db;
    private readonly CloudinaryService _cloudinary;

    public HomeAnnouncementService(
        AppDbContext db,
        CloudinaryService cloudinary)
    {
        _db = db;
        _cloudinary = cloudinary;
    }

    // ==========================
    // GET ACTIVE (PUBLIC)
    // ==========================
    public async Task<HomeAnnouncementDTO?> GetActiveAsync(CancellationToken ct)
    {
        return await _db.HomeAnnouncements
            .Include(h => h.Media)
            .Where(h => h.IsActive)
            .OrderByDescending(h => h.CreatedAt)
            .Select(h => new HomeAnnouncementDTO
            {
                Id = h.Id,
                Title = h.Title,
                ContentHtml = h.ContentHtml,
                ImageUrl = h.Media != null ? h.Media.Url : null,
                CreatedAt = h.CreatedAt
            })
            .FirstOrDefaultAsync(ct);
    }

    public async Task<HomeAnnouncementDTO?> GetByIdAsync(long id, CancellationToken ct)
    {
        var entity = await _db.HomeAnnouncements
            .Include(h => h.Media)
            .FirstOrDefaultAsync(h => h.Id == id, ct);

        if (entity == null) return null;
    
        return new HomeAnnouncementDTO
        {
            Id = entity.Id,
            Title = entity.Title,
            ContentHtml = entity.ContentHtml,
            ImageUrl = entity.Media?.Url,
            CreatedAt = entity.CreatedAt
        };
    }

    // ==========================
    // CREATE (ADMIN)
    // ==========================
    public async Task<long> CreateAsync(CreateHomeAnnouncementRequest dto, CancellationToken ct)
    {
        // деактивуємо всі попередні
        var active = await _db.HomeAnnouncements
            .Where(h => h.IsActive)
            .ToListAsync(ct);

        foreach (var a in active)
            a.IsActive = false;

        Media? media = null;

        if (dto.Media != null)
        {
            var url = await _cloudinary.UploadPostMediaAsync(
                dto.Media,
                "home-announcements"
            );

            media = new Media
            {
                Url = url,
                Type = MediaType.HomeAnnouncement_image
            };

            _db.Medias.Add(media);
        }

        var announcement = new HomeAnnouncement
        {
            Title = dto.Title,
            ContentHtml = dto.ContentHtml,
            Media = media,
            IsActive = true
        };

        _db.HomeAnnouncements.Add(announcement);
        await _db.SaveChangesAsync(ct);

        return announcement.Id;
    }

    // ==========================
    // UPDATE (ADMIN)
    // ==========================
    public async Task UpdateAsync(long id, UpdateHomeAnnouncementRequest dto, CancellationToken ct)
    {
        var entity = await _db.HomeAnnouncements
            .Include(h => h.Media)
            .FirstOrDefaultAsync(h => h.Id == id, ct);

        if (entity == null)
            throw new KeyNotFoundException("Announcement not found");

        if (dto.Title != null)
            entity.Title = dto.Title;

        if (dto.ContentHtml != null)
            entity.ContentHtml = dto.ContentHtml;

        if (dto.IsActive.HasValue)
            entity.IsActive = dto.IsActive.Value;

        if (dto.Media != null)
        {
            var url = await _cloudinary.UploadPostMediaAsync(
                dto.Media,
                "home-announcements"
            );

            if (entity.Media == null)
            {
                entity.Media = new Media
                {
                    Url = url,
                    Type = MediaType.HomeAnnouncement_image
                };
                _db.Medias.Add(entity.Media);
            }
            else
            {
                entity.Media.Url = url;
            }
        }

        await _db.SaveChangesAsync(ct);
    }

    // ==========================
    // DEACTIVATE (ADMIN)
    // ==========================
    public async Task DeactivateAsync(long id, CancellationToken ct)
    {
        var entity = await _db.HomeAnnouncements
            .FirstOrDefaultAsync(h => h.Id == id, ct);

        if (entity == null)
            throw new KeyNotFoundException("Announcement not found");

        entity.IsActive = false;
        await _db.SaveChangesAsync(ct);
    }
}
