using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AniRiseBackend.Services;
using AniRiseBackend.Helpers; 

namespace AniRiseBackend.Controllers;

[ApiController]
[Route("api/news")]
public class NewsController : ControllerBase
{
    private readonly INewsService _service;

    private readonly CloudinaryService _cloudinaryService;

    public NewsController(INewsService service, CloudinaryService cloudinaryService)
    {
        _service = service;
        _cloudinaryService = cloudinaryService;
    }


    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var news = await _service.GetAllAsync(ct);
        return Ok(news);
    }

    [HttpGet("query")]
    public async Task<IActionResult> GetByQuery([FromQuery] NewsRequestParams query, CancellationToken ct)
    {
        // If a page is specified, convert the offset
        int offset = query.Offset > 0 ? query.Offset : (query.Page - 1) * query.Limit;

        var news = await _service.GetByQueryAsync(query.Limit, offset, query.SortBy, query.SortOrder, ct);
        return Ok(news);
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> Get(long id, CancellationToken ct)
    {
        Guid? userId = User.Identity?.IsAuthenticated == true
            ? User.GetUserId()
            : (Guid?)null;

        var news = await _service.GetByIdAsync(id, userId, ct);

        if (news == null)
            return NotFound(new { message = "News not found." });

        return Ok(news);
    }
    
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] NewsCreateRequest request, CancellationToken ct)
    {
        // Only the admin can create
        if (!User.IsAdmin())
        {
            return StatusCode(403, new { message = "Only admins can create news. You aren't an admin!" });
        }


        var authorId = User.GetUserId();
        var id = await _service.CreateAsync(request, authorId, ct);
        return Ok(new { id });
    }

    [Authorize]
    [HttpPut("{id:long}")]
    public async Task<IActionResult> Update(long id, [FromBody] NewsUpdateRequest request, CancellationToken ct)
    {
        // Only the admin can update
        if (!User.IsAdmin())
            return Forbid("Only admins can update news.");

        var ok = await _service.UpdateAsync(id, request, ct);
        return ok ? Ok() : NotFound(new { message = "News not found." });
    }

    [Authorize]
    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id, CancellationToken ct)
    {
        // Only the admin can delete
        if (!User.IsAdmin())
            return Forbid("Only admins can delete news.");

        var ok = await _service.DeleteAsync(id, ct);
        return ok ? Ok() : NotFound(new { message = "News not found." });
    }

    [Authorize]
    [HttpPost("{id:long}/reaction")]
    public async Task<IActionResult> AddReaction(long id, [FromQuery] ReactionType type, CancellationToken ct)
    {
        // Anyone who is logged in can add reactions
        var userId = User.GetUserId();
        await _service.AddReactionAsync(id, userId, type, ct);
        return Ok(new { message = "Reaction added." });
    }

    [Authorize]
    [HttpDelete("{id:long}/reaction")]
    public async Task<IActionResult> RemoveReaction(long id, CancellationToken ct)
    {
        // Any logged-in user can delete their reactions
        var userId = User.GetUserId();
        await _service.RemoveReactionAsync(id, userId, ct);
        return Ok(new { message = "Reaction removed." });
    }

    [Authorize]
    [HttpPost("media")]
    public async Task<IActionResult> UploadNewsMedia(IFormFile file)
    {
        var url = await _cloudinaryService.UploadPostMediaAsync(file, "news");
        return Ok(new { url });
    }
}
