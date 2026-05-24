using AniRiseBackend.Models;
using AniRiseBackend.Dtos.Admin;
using AniRiseBackend.Data;
using Microsoft.EntityFrameworkCore;

namespace AniRiseBackend.Services;

public interface IMediaService
{
    Task<List<AdminMediaDto>> GetEntityMediaAsync(string entity, long entityId);
    Task<AdminMediaDto> AttachMediaAsync(string entity, long entityId, MediaType type, string url);
    Task UpdateMediaTypeAsync(long mediaId, MediaType type);
    Task DeleteMediaAsync(long mediaId);
}

public class MediaService : IMediaService
{
    private readonly AppDbContext _db;

    public MediaService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<AdminMediaDto>> GetEntityMediaAsync(string entity, long entityId)
    {
        return entity switch
        {
            "anime" => await _db.AnimeMedias
                .Where(x => x.AnimeId == entityId)
                .Select(x => new AdminMediaDto
                {
                    Id = x.Media.Id,
                    Url = x.Media.Url,
                    Type = x.Media.Type
                })
                .ToListAsync(),

            "author" => await _db.AuthorMedias
                .Where(x => x.AuthorId == entityId)
                .Select(x => new AdminMediaDto
                {
                    Id = x.Media.Id,
                    Url = x.Media.Url,
                    Type = x.Media.Type
                })
                .ToListAsync(),

            "character" => await _db.CharacterMedias
                .Where(x => x.CharacterId == entityId)
                .Select(x => new AdminMediaDto
                {
                    Id = x.Media.Id,
                    Url = x.Media.Url,
                    Type = x.Media.Type
                })
                .ToListAsync(),

            "studio" => await _db.StudioMedias
                .Where(x => x.StudioId == entityId)
                .Select(x => new AdminMediaDto
                {
                    Id = x.Media.Id,
                    Url = x.Media.Url,
                    Type = x.Media.Type
                })
                .ToListAsync(),

            _ => throw new ArgumentException("Unsupported entity")
        };
    }

    public async Task<AdminMediaDto> AttachMediaAsync(string entity, long entityId, MediaType type, string url)
    {
        entity = entity.ToLowerInvariant();

        entity = entity switch
        {
            "animes" => "anime",
            "authors" => "author",
            "characters" => "character",
            "studios" => "studio",
            _ => entity
        };
        
        switch (entity)
        {
            case "anime":
                if (!await _db.Animes.AnyAsync(a => a.Id == entityId))
                    throw new Exception("Anime not found");
                break;
            case "author":
                if (!await _db.Authors.AnyAsync(a => a.Id == entityId))
                    throw new Exception("Author not found");
                break;
            case "character":
                if (!await _db.Characters.AnyAsync(c => c.Id == entityId))
                    throw new Exception("Character not found");
                break;
            case "studio":
                if (!await _db.Studios.AnyAsync(s => s.Id == entityId))
                    throw new Exception("Studio not found");
                break;
            default:
                throw new ArgumentException("Unsupported entity");
        }

        var media = new Media
        {
            Url = url,
            Type = type
        };

        _db.Medias.Add(media);
        await _db.SaveChangesAsync();

        switch (entity)
        {
            case "anime":
                _db.AnimeMedias.Add(new AnimeMedia
                {
                    AnimeId = entityId,
                    MediaId = media.Id
                });
                break;
            case "author":
                _db.AuthorMedias.Add(new AuthorMedia
                {
                    AuthorId = entityId,
                    MediaId = media.Id
                });
                break;
            case "character":
                _db.CharacterMedias.Add(new CharacterMedia
                {
                    CharacterId = entityId,
                    MediaId = media.Id
                });
                break;
            case "studio":
                _db.StudioMedias.Add(new StudioMedia
                {
                    StudioId = entityId,
                    MediaId = media.Id
                });
                break;
        }

        await _db.SaveChangesAsync();

        return new AdminMediaDto
        {
            Id = media.Id,
            Url = media.Url,
            Type = media.Type
        };
    }

    public async Task UpdateMediaTypeAsync(long mediaId, MediaType type)
    {
        var media = await _db.Medias.FindAsync(mediaId);
        if (media == null)
            throw new Exception("Media not found");

        media.Type = type;
        await _db.SaveChangesAsync();
    }

    public async Task DeleteMediaAsync(long mediaId)
    {
        var media = await _db.Medias
            .Include(m => m.AnimeMedias)
            .Include(m => m.AuthorMedias)
            .Include(m => m.CharacterMedias)
            .Include(m => m.StudioMedias)
            .FirstOrDefaultAsync(m => m.Id == mediaId);

        if (media == null) return;

        _db.AnimeMedias.RemoveRange(media.AnimeMedias);
        _db.AuthorMedias.RemoveRange(media.AuthorMedias);
        _db.CharacterMedias.RemoveRange(media.CharacterMedias);
        _db.StudioMedias.RemoveRange(media.StudioMedias);

        _db.Medias.Remove(media);
        await _db.SaveChangesAsync();
    }
}
