using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AniRiseBackend.Helpers;
using AniRiseBackend.Contracts;

[ApiController]
[Route("api/home-announcement")]
public class HomeAnnouncementController : ControllerBase
{
    private readonly IHomeAnnouncementService _service;

    public HomeAnnouncementController(IHomeAnnouncementService service)
    {
        _service = service;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<HomeAnnouncementDTO>> Get(CancellationToken ct)
    {
        var result = await _service.GetActiveAsync(ct);
        if (result == null)
            return NoContent();

        return Ok(result);
    }

    [HttpGet("{id:long}")]
    [AllowAnonymous]
    public async Task<ActionResult<HomeAnnouncementDTO>> GetById(long id, CancellationToken ct)
    {
        var result = await _service.GetByIdAsync(id, ct);
        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(
        [FromForm] CreateHomeAnnouncementRequest dto,
        CancellationToken ct)
    {
        if (!User.IsAdmin())
            return Forbid();

        await _service.CreateAsync(dto, ct);
        return Ok();
    }

    [HttpPut("{id:long}")]
    [Authorize]
    public async Task<IActionResult> Update(
        long id,
        [FromForm] UpdateHomeAnnouncementRequest dto,
        CancellationToken ct)
    {
        if (!User.IsAdmin())
            return Forbid();

        await _service.UpdateAsync(id, dto, ct);
        return Ok();
    }

    [HttpDelete("{id:long}")]
    [Authorize]
    public async Task<IActionResult> Deactivate(long id, CancellationToken ct)
    {
        if (!User.IsAdmin())
            return Forbid();

        await _service.DeactivateAsync(id, ct);
        return Ok();
    }
}
