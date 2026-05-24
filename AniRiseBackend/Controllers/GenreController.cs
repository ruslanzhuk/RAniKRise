using AniRiseBackend.Models;
using AniRiseBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace AniRiseBackend.Controllers;

[ApiController]
[Route("api/genres")]
public class GenreController : ControllerBase
{
    private readonly GenreService _genreService;

    public GenreController(GenreService genreService)
    {
        _genreService = genreService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Genre>>> GetAll(CancellationToken ct)
    {
        var genres = await _genreService.GetAllGenresAsync(ct);
        return Ok(genres);
    }
}
