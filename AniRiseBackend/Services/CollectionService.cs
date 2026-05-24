using AniRiseBackend.Data;
using AniRiseBackend.Models;
using AniRiseBackend.Dtos;
using AniRiseBackend.Contracts;
using Microsoft.EntityFrameworkCore;

namespace AniRiseBackend.Services;

public class CollectionService
{
    private readonly AppDbContext _db;

    public CollectionService(AppDbContext db)
    {
        _db = db;
    }

    /* =========================
     * CREATE
     * ========================= */
    public async Task<CollectionDTO> CreateAsync(
        Guid userId,
        string name,
        string? description
    )
    {
        var collection = new Collection
        {
            UserId = userId,
            Name = name.Trim(),
            Description = description ?? "",
            CreatedAt = DateTime.UtcNow
        };

        _db.Collections.Add(collection);

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            // MySQL duplicate key
            if (ex.InnerException?.Message.Contains("Duplicate") == true)
            {
                throw new DuplicateCollectionException(
                    $"Collection '{name}' already exists."
                );
            }

            throw;
        }

        return Map(collection);
    }

    /* =========================
     * GET USER COLLECTIONS
     * ========================= */
    public async Task<List<CollectionDTO>> GetUserCollectionsAsync(Guid userId)
    {
        return await _db.Collections
            .Where(c => c.UserId == userId)
            .Include(c => c.CollectionAnimes)
                .ThenInclude(ca => ca.Anime)
                    .ThenInclude(a => a.Media)
                        .ThenInclude(am => am.Media)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => Map(c))
            .ToListAsync();
    }

    /* =========================
     * FAVORITES (AUTO-CREATE)
     * ========================= */
    public async Task<CollectionDTO> GetFavoritesAsync(Guid userId)
    {
        var favorites = await _db.Collections
            .Include(c => c.CollectionAnimes)
                .ThenInclude(ca => ca.Anime)
                    .ThenInclude(a => a.Media)
                        .ThenInclude(am => am.Media)
            .FirstOrDefaultAsync(c =>
                c.UserId == userId && c.Name == "Favorites");

        if (favorites == null)
        {
            favorites = new Collection
            {
                UserId = userId,
                Name = "Favorites",
                Description = "Favorite anime",
                CreatedAt = DateTime.UtcNow
            };

            _db.Collections.Add(favorites);

            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                favorites = await _db.Collections
                    .Include(c => c.CollectionAnimes)
                        .ThenInclude(ca => ca.Anime)
                    .FirstAsync(c =>
                        c.UserId == userId && c.Name == "Favorites");
            }
        }

        return Map(favorites);
    }

    public async Task<List<CollectionDTO>> GetUserCollectionsPublicAsync(Guid userId)
    {
        var collections = await _db.Collections
            .Where(c => c.UserId == userId)
            .Include(c => c.CollectionAnimes)
                .ThenInclude(ca => ca.Anime)
                    .ThenInclude(a => a.Media)
                        .ThenInclude(am => am.Media)
            .ToListAsync();

        return collections.Select(Map).ToList();
    }

    /* =========================
     * ADD ANIME
     * ========================= */
    public async Task AddAnimeAsync(long collectionId, long animeId, Guid userId)
    {
        var collection = await _db.Collections
            .FirstOrDefaultAsync(c => c.Id == collectionId && c.UserId == userId);

        if (collection == null)
            throw new Exception("Collection not found or access denied.");

        var exists = await _db.CollectionAnimes
            .AnyAsync(ca => ca.CollectionId == collectionId && ca.AnimeId == animeId);

        if (exists) return;

        _db.CollectionAnimes.Add(new CollectionAnime
        {
            CollectionId = collectionId,
            AnimeId = animeId
        });

        await _db.SaveChangesAsync();
    }

    /* =========================
     * REMOVE ANIME
     * ========================= */
    public async Task RemoveAnimeAsync(long collectionId, long animeId, Guid userId)
    {
        var relation = await _db.CollectionAnimes
            .Include(ca => ca.Collection)
            .FirstOrDefaultAsync(ca =>
                ca.CollectionId == collectionId &&
                ca.AnimeId == animeId &&
                ca.Collection.UserId == userId);

        if (relation == null)
            throw new Exception("Anime not found in collection.");

        _db.CollectionAnimes.Remove(relation);
        await _db.SaveChangesAsync();
    }

    /* =========================
     * DELETE COLLECTION
     * ========================= */
    public async Task DeleteAsync(long collectionId, Guid userId)
    {
        var collection = await _db.Collections
            .Include(c => c.CollectionAnimes)
            .FirstOrDefaultAsync(c =>
                c.Id == collectionId && c.UserId == userId);

        if (collection == null)
            throw new Exception("Collection not found.");

        _db.CollectionAnimes.RemoveRange(collection.CollectionAnimes);
        _db.Collections.Remove(collection);

        await _db.SaveChangesAsync();
    }

    /* =========================
     * MAPPER
     * ========================= */
    private static CollectionDTO Map(Collection c)
    {
        return new CollectionDTO
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            CreatedAt = c.CreatedAt,
            Animes = c.CollectionAnimes.Select(ca => new AnimeShortDTO
            {
                Id = ca.Anime.Id,
                Title = ca.Anime.Title,
                ImageUrl =
                    ca.Anime.Media
                        .Select(am => am.Media)
                        .FirstOrDefault(m => m.Type == MediaType.Anime_poster)
                        ?.Url
                    ??
                    ca.Anime.Media
                        .Select(am => am.Media)
                        .FirstOrDefault(m => m.Type == MediaType.Anime_poster_inactive)
                        ?.Url
            }).ToList()
        };
    }

    public async Task SyncAnimeCollectionsAsync(
        Guid userId,
        long animeId,
        List<long> targetCollectionIds
    )
    {
        // 1. All user collections
        var userCollections = await _db.Collections
            .Where(c => c.UserId == userId)
            .Select(c => c.Id)
            .ToListAsync();

        // protection: you cannot transfer other people's collections
        var validTargetIds = targetCollectionIds
            .Where(id => userCollections.Contains(id))
            .ToHashSet();

        // 2. All existing links between anime and collections
        var existingRelations = await _db.CollectionAnimes
            .Include(ca => ca.Collection)
            .Where(ca =>
                ca.AnimeId == animeId &&
                ca.Collection.UserId == userId
            )
            .ToListAsync();

        var existingCollectionIds = existingRelations
            .Select(ca => ca.CollectionId)
            .ToHashSet();

        // 3. What needs to be ADDED
        var toAdd = validTargetIds
            .Except(existingCollectionIds);

        foreach (var collectionId in toAdd)
        {
            _db.CollectionAnimes.Add(new CollectionAnime
            {
                CollectionId = collectionId,
                AnimeId = animeId
            });
        }

        // 4. What needs to be CLEANED UP
        var toRemove = existingRelations
            .Where(ca => !validTargetIds.Contains(ca.CollectionId))
            .ToList();

        _db.CollectionAnimes.RemoveRange(toRemove);

        await _db.SaveChangesAsync();
    }

}
