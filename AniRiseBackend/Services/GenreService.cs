using AniRiseBackend.Data;
using AniRiseBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace AniRiseBackend.Services;

public class GenreService
{
    private readonly AppDbContext _db;

    public GenreService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Genre>> GetAllGenresAsync(CancellationToken ct)
    {
        return await _db.Genres
            .OrderBy(g => g.Name)
            .ToListAsync(ct);
    }
}
