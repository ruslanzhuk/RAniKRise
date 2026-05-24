using AniRiseBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AniRiseBackend.Services;

namespace AniRiseBackend.Controllers;

[ApiController]
[Route("api/user-anime/status")]
[Authorize]
public class UserAnimeStatusController : ControllerBase
{
    private readonly IUserAnimeStatusService _statusService;

    public UserAnimeStatusController(IUserAnimeStatusService statusService)
    {
        _statusService = statusService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{animeId}/status")]
    public async Task<IActionResult> GetStatus(long animeId)
    {
        var userId = GetUserId();
        var status = await _statusService.GetStatusAsync(userId, animeId);
        if (status == null)
            return NotFound(new { message = "Status not set for this anime." });
        return Ok(status);
    }

    [HttpPost("{animeId}")]
    public async Task<IActionResult> SetStatus(long animeId, [FromQuery] WatchStatusEnum status)
    {
        var userId = GetUserId();
        var result = await _statusService.SetStatusAsync(userId, animeId, status);
        return Ok(result);
    }

    [HttpDelete("{animeId}")]
    public async Task<IActionResult> RemoveStatus(long animeId)
    {
        var userId = GetUserId();
        var success = await _statusService.RemoveStatusAsync(userId, animeId);
        if (!success) return NotFound();
        return Ok();
    }

    [HttpPost("{animeId}/rating")]
    public async Task<IActionResult> SetRating(long animeId, [FromQuery] int score)
    {
        var userId = GetUserId();
        var result = await _statusService.SetRatingAsync(userId, animeId, score);
        return Ok(result);
    }

    [HttpGet("{animeId}/rating")]
    public async Task<IActionResult> GetRating(long animeId)
    {
        var userId = GetUserId();
        var rating = await _statusService.GetRatingAsync(userId, animeId);
        if (rating == null) return NotFound();
        return Ok(rating);
    }

    [HttpDelete("{animeId}/rating")]
    public async Task<IActionResult> RemoveRating(long animeId)
    {
        var userId = GetUserId();
        var result = await _statusService.RemoveRatingAsync(userId, animeId);
        if (result == null) return NotFound();
        return Ok(result);
    }

}
