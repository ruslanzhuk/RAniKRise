using AniRiseBackend.Contracts;
using AniRiseBackend.Data;
using AniRiseBackend.Dtos;
using AniRiseBackend.Contracts.Anime;
using Microsoft.AspNetCore.Mvc;
using AniRiseBackend.Services;

using AniRiseBackend.Contracts.Jikan;

namespace AniRiseBackend.Controllers;

[ApiController]
[Route("api/anime")]
public class AnimeController : ControllerBase
{
    private readonly AppDbContext _dbcontext;
    private readonly AnimeService _animeService;
    public AnimeController(AppDbContext dbcontext, AnimeService animeService)
    {
        _dbcontext = dbcontext;
        _animeService = animeService;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] GetAnimeRequest request, CancellationToken ct)
    {
        return Ok(new GetAnimeResponse(await _animeService.GetAllAsync(request, ct)));
    }


    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetById(long id, CancellationToken ct)
    {
        var anime = await _animeService.GetByIdAsync(id, ct);
        return anime is null ? NotFound() : Ok(anime);
    }

    [HttpGet("{id:long}/details")]
    public async Task<IActionResult> GetDetails(long id, CancellationToken ct)
    {
        var animeDetails = await _animeService.GetDetailsAsync(id, ct);
        if (animeDetails == null)
            return NotFound();

        return Ok(animeDetails);
    }

    [HttpGet("airing")]
    public async Task<IActionResult> GetAiringAnime([FromQuery] GetAnimeRequest request, CancellationToken ct)
    {
        var animes = await _animeService.GetCurrentlyAiringAsync(request, ct);
        return Ok(new GetAnimePreviewResponse(animes));
    }

    [HttpGet("upcoming")]
    public async Task<IActionResult> GetUpcomingAnime([FromQuery] GetAnimeRequest request, CancellationToken ct)
    {
        var animes = await _animeService.GetUpcomingAsync(request, ct);
        return Ok(new GetAnimePreviewResponse(animes));
    }

    [HttpGet("popular")]
    public async Task<IActionResult> GetPopularAnime(
        [FromQuery] GetAnimeRequest request,
        CancellationToken ct
    )
    {
        var animes = await _animeService.GetPopularAsync(request, ct);
        return Ok(new GetAnimePreviewResponse(animes));
    }

    [HttpGet("top-series")]
    public async Task<IActionResult> GetTopSeries([FromQuery] GetAnimeRequest request, CancellationToken ct)
    {
        var data = await _animeService.GetTopSeriesAsync(request, ct);
        return Ok(new GetAnimePreviewResponse(data));
    }

    [HttpGet("top-movies")]
    public async Task<IActionResult> GetTopMovies([FromQuery] GetAnimeRequest request, CancellationToken ct)
    {
        var data = await _animeService.GetTopMoviesAsync(request, ct);
        return Ok(new GetAnimePreviewResponse(data));
    }

    [HttpGet("top-rated")]
    public async Task<IActionResult> GetTopRated([FromQuery] GetAnimeRequest request, CancellationToken ct)
    {
        var data = await _animeService.GetTopRatedAsync(request, ct);
        return Ok(new GetAnimePreviewResponse(data));
    }

    [HttpPost("search")]
    public async Task<ActionResult<PagedAnimeResult<AnimeCardDTO>>> Search(
        [FromBody] AnimeSearchRequest request)
    {
        var result = await _animeService.SearchAsync(request);
        return Ok(result);
    }

    [HttpGet("by-character/{characterId:long}")]
    public async Task<IActionResult> GetByCharacter(long characterId)
    {
        var animes = await _animeService.GetAnimeByCharacterAsync(characterId);
        return Ok(animes);
    }
}
