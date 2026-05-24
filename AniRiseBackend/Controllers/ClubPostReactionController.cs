using AniRiseBackend.Dtos;
using AniRiseBackend.Helpers;
using AniRiseBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniRiseBackend.Controllers;

[ApiController]
[Route("api/clubs/posts")]
[Authorize]
public class ClubPostReactionController : ControllerBase
{
    private readonly ClubPostReactionService _service;

    public ClubPostReactionController(ClubPostReactionService service)
    {
        _service = service;
    }

    // POST /api/clubs/posts/{postId}/reaction
    [HttpPost("{postId:long}/reaction")]
    public async Task<IActionResult> React(
        long postId,
        [FromBody] ClubPostReactionRequest request)
    {
        var userId = User.GetUserId();

        var ok = await _service.ReactAsync(
            postId,
            userId,
            request.Reaction);

        return ok ? Ok() : Forbid();
    }
}
