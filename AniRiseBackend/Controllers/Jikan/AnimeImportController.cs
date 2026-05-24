using Microsoft.AspNetCore.Mvc;
using AniRiseBackend.Services;

[ApiController]
[Route("anime")]
public class AnimeImportController : ControllerBase
{
    private readonly AnimeImportService _importService;

    public AnimeImportController(AnimeImportService importService)
    {
        _importService = importService;
    }

    [HttpPost("import/{id}")]
    public async Task<IActionResult> Import(long id)
    {
        try
        {
            var anime = await _importService.ImportAnimeByIdAsync(id);
            if (anime == null) return NotFound();
            return Ok(anime);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Unexpected error", detail = ex.Message });
        }
    }

    [HttpGet("import/preview/{id}")]
    public async Task<IActionResult> Preview(long id)
    {
        var data = await _importService.GetAnimeByIdAsync(id);
        if (data == null) return NotFound();
        return Ok(data);
    }

    [HttpGet("import/fullpreview/{id}")]
    public async Task<IActionResult> Fullpreview(long id)
    {
        var anime = await _importService.PreviewAnimeByIdAsync(id);
        if (anime == null) return NotFound();

        return Ok(anime);
    }

    [HttpPost("import/sync/{id}")]
    public async Task<IActionResult> Sync(long id)
    {
        try
        {
            var anime = await _importService.SyncAnimeByIdAsync(id);
            if (anime == null) return NotFound();
            return Ok(anime);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                message = "Unexpected error", 
                detail = ex.Message, 
                stack = ex.StackTrace 
            });
        }
    }
}
