using AniRiseBackend.Helpers;
using AniRiseBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AniRiseBackend.Models;

namespace AniRiseBackend.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly NotificationService _service;

    public NotificationController(NotificationService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var me = User.GetUserId();
        var notifications = await _service.GetAsync(me);

        var dto = notifications.Select(n => new {
            id = n.Id,
            message = n.Message,
            createdAt = n.CreatedAt,
            isRead = n.Status == NotificationStatus.Read,
            type = n.Type.ToString(),
            referenceId = n.ReferenceId
        }).ToList();

        return Ok(dto);
    }


    [HttpPost("{id:long}/read")]
    public async Task<IActionResult> Read(long id)
    {
        var me = User.GetUserId();
        var ok = await _service.MarkAsReadAsync(id, me);
        return ok ? Ok() : NotFound();
    }
}
