using AniRiseBackend.Data;
using Microsoft.AspNetCore.Mvc;
using AniRiseBackend.Services;


namespace AniRiseBackend.Controllers;

[ApiController]
[Route("jikan")]
public class AnimeGetController : ControllerBase
{

    private readonly AppDbContext _dbcontext;
    private readonly AnimeGetService _animeService;
    public AnimeGetController(AppDbContext dbcontext, AnimeGetService animeService)
    {
        _dbcontext = dbcontext;
        _animeService = animeService;
    }

    [HttpGet("preview/{id}")]
    public async Task<IActionResult> Preview(long id)
    {
        var anime = await _animeService.GetAnimePreviewAsync(id);
        if (anime == null) return NotFound();

        return Ok(new
        {
            anime.Id,
            anime.Title,
            anime.PosterUrl,
            anime.Type,
            anime.Year,
            anime.Score
        });
    }

    [HttpGet("hover/{id}")]
    public async Task<IActionResult> Hover(long id)
    {
        var anime = await _animeService.GetAnimePreviewAsync(id);
        if (anime == null) return NotFound();

        return Ok(anime);
    }

    [HttpGet("popular")]
    public async Task<IActionResult> GetPopular([FromQuery] int limit = 10)
    {
        var data = await _animeService.GetPopularAnimeAsync(limit);
        return Ok(data);
    }

    [HttpGet("airing")]
    public async Task<IActionResult> GetCurrentlyAiring([FromQuery] int limit = 10)
    {
        var data = await _animeService.GetCurrentlyAiringAnimeAsync(limit);
        return Ok(data);
    }

    [HttpGet("top-series")]
    public async Task<IActionResult> GetTopSeries([FromQuery] int limit = 10)
    {
        var data = await _animeService.GetTopSeriesAsync(limit);
        return Ok(data);
    }

    [HttpGet("top-movies")]
    public async Task<IActionResult> GetTopMovies([FromQuery] int limit = 10)
    {
        var data = await _animeService.GetTopMoviesAsync(limit);
        return Ok(data);
    }

    [HttpGet("top-rated")]
    public async Task<IActionResult> GetTopRated([FromQuery] int limit = 10)
    {
        var data = await _animeService.GetTopRatedAnimeAsync(limit);
        return Ok(data);
    }
}