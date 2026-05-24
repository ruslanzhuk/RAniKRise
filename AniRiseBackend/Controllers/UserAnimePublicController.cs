using AniRiseBackend.Models;
using AniRiseBackend.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/user-anime/public")]
public class UserAnimePublicController : ControllerBase
{
    private readonly IUserAnimePublicService _service;

    public UserAnimePublicController(IUserAnimePublicService service)
    {
        _service = service;
    }

    [HttpGet("{username}/stats")]
    public async Task<IActionResult> GetStats(string username)
    {
        var stats = await _service.GetUserStatsAsync(username);
        return Ok(stats);
    }

    [HttpGet("{username}/list")]
    public async Task<IActionResult> GetList(
        string username,
        [FromQuery] string? status
    )
    {
        WatchStatusEnum? parsedStatus = null;

        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<WatchStatusEnum>(status, true, out var s))
        {
            parsedStatus = s;
        }

        var list = await _service.GetUserAnimeListAsync(username, parsedStatus);
        return Ok(list);
    }
}
