using AniRiseBackend.Helpers;
using AniRiseBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniRiseBackend.Controllers;

[ApiController]
[Route("api/friends")]
[Authorize]
public class FriendshipController : ControllerBase
{
    private readonly FriendshipService _service;

    public FriendshipController(FriendshipService service)
    {
        _service = service;
    }

    [HttpPost("request/{userId:guid}")]
    public async Task<IActionResult> Send(Guid userId)
    {
        var me = User.GetUserId();
        var ok = await _service.SendRequestAsync(me, userId);
        return ok ? Ok() : BadRequest();
    }

    [HttpPost("{friendshipId:long}/accept")]
    public async Task<IActionResult> Accept(long friendshipId)
    {
        var me = User.GetUserId();
        var ok = await _service.RespondAsync(friendshipId, me, true);
        return ok ? Ok() : BadRequest();
    }

    [HttpPost("{friendshipId:long}/reject")]
    public async Task<IActionResult> Reject(long friendshipId)
    {
        var me = User.GetUserId();
        var ok = await _service.RespondAsync(friendshipId, me, false);
        return ok ? Ok() : BadRequest();
    }

    [HttpGet("status/{userId:guid}")]
    public async Task<IActionResult> Status(Guid userId)
    {
        var me = User.GetUserId();
        return Ok(await _service.GetFriendshipStatusAsync(me, userId));
    }

    [AllowAnonymous]
    [HttpGet("preview/{userId:guid}")]
    public async Task<IActionResult> Preview(Guid userId)
    {
        return Ok(await _service.GetFriendPreviewAsync(userId));
    }
}
