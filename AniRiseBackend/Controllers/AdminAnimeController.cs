using AniRiseBackend.Contracts;
using AniRiseBackend.Contracts.Admin;
using AniRiseBackend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AniRiseBackend.Controllers.Admin;

[ApiController]
[Route("api/admin/anime")]
public class AdminAnimeController : ControllerBase
{
    private readonly AnimeService _animeService;

    public AdminAnimeController(AnimeService animeService)
    {
        _animeService = animeService;
    }

    // GET: api/admin/anime
    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] GetAnimeRequest request,
        CancellationToken ct)
    {
        var (items, totalCount) =
            await _animeService.GetAdminAnimesAsync(request, ct);

        return Ok(new GetAdminAnimeResponse
        {
            Items = items,
            TotalCount = totalCount
        });
    }

    // DETAILS (edit)
    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetById(long id, CancellationToken ct)
    {
        var anime = await _animeService.GetAdminDetailsAsync(id, ct);
        return anime == null ? NotFound() : Ok(anime);
    }

    // CREATE
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateAdminAnimeRequest request,
        CancellationToken ct)
    {
        var anime = await _animeService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = anime.Id }, anime.Id);
    }

    // UPDATE
    [HttpPut("{id:long}")]
    public async Task<IActionResult> Update(
        long id,
        [FromBody] UpdateAdminAnimeRequest request,
        CancellationToken ct)
    {
        var success = await _animeService.UpdateAsync(id, request, ct);
        return success ? NoContent() : NotFound();
    }

    // DELETE
    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id, CancellationToken ct)
    {
        var success = await _animeService.DeleteAsync(id, ct);
        return success ? NoContent() : NotFound();
    }
}