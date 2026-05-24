using AniRiseBackend.Data;
using AniRiseBackend.Dtos.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniRiseBackend.Controllers;


[Authorize]
[ApiController]
[Route("api/admin/media-browser")]
public class MediaBrowserController : ControllerBase
{
    private readonly AppDbContext _context;

    public MediaBrowserController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("anime")]
    public async Task<IActionResult> GetAnime()
    {
        return Ok(await _context.Animes
            .Select(a => new MediaEntityListDTO
            {
                Id = a.Id,
                Title = a.Title,
                MediaCount = a.Media.Count
            })
            .ToListAsync());
    }

    [HttpGet("authors")]
    public async Task<IActionResult> GetAuthors()
    {
        return Ok(await _context.Authors
            .Select(a => new MediaEntityListDTO
            {
                Id = a.Id,
                Title = a.Name,
                MediaCount = a.Media.Count
            })
            .ToListAsync());
    }

    [HttpGet("characters")]
    public async Task<IActionResult> GetCharacters()
    {
        return Ok(await _context.Characters
            .Select(c => new MediaEntityListDTO
            {
                Id = c.Id,
                Title = c.Name,
                MediaCount = c.Media.Count
            })
            .ToListAsync());
    }

    [HttpGet("studios")]
    public async Task<IActionResult> GetStudios()
    {
        return Ok(await _context.Studios
            .Select(s => new MediaEntityListDTO
            {
                Id = s.Id,
                Title = s.Name,
                MediaCount = s.Media.Count
            })
            .ToListAsync());
    }
}
