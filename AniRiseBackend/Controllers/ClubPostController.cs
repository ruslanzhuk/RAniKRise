using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AniRiseBackend.Services;
using AniRiseBackend.Helpers;
using AniRiseBackend.Contracts;

namespace AniRiseBackend.Controllers;

[ApiController]
[Route("api/clubs")]
[Authorize]
public class ClubPostController : ControllerBase
{
    private readonly ClubPostService _service;
    private readonly CloudinaryService _cloudinaryService;

    public ClubPostController(ClubPostService service, CloudinaryService cloudinaryService)
    {
        _service = service;
        _cloudinaryService = cloudinaryService;
    }

    [HttpGet("{clubId:long}/posts")]
    [AllowAnonymous]
    public async Task<IActionResult> Get(
        long clubId,
        int offset = 0,
        int limit = 10)
    {
        Console.WriteLine($"Authenticated: {User.Identity?.IsAuthenticated}");
        Guid? userId = null;

        if (User.Identity?.IsAuthenticated == true)
            userId = User.GetUserId();

        Console.WriteLine($"UserId: {userId}");

        return Ok(await _service.GetByClubAsync(clubId, userId, offset, limit));
    }

    [HttpGet("posts/{postId:long}")]
    public async Task<IActionResult> GetById(long postId)
    {
        Guid? userId = null;
        if (User.Identity?.IsAuthenticated == true)
            userId = User.GetUserId();

        var post = await _service.GetByIdAsync(postId, userId);
        return post == null ? NotFound() : Ok(post);
    }



    [HttpPost("{clubId:long}/posts")]
    public async Task<IActionResult> Create(long clubId, [FromForm] ClubPostCreateRequest request)
    {
        var userId = User.GetUserId();
        var postDto = await _service.CreateAsync(clubId, userId, request);
        return postDto != null ? Ok(postDto) : Forbid();
    }

    [HttpPut("posts/{postId:long}")]
    public async Task<IActionResult> Update(long postId, [FromForm] ClubPostUpdateRequest request)
    {
        var userId = User.GetUserId();
        var dto = await _service.UpdateAsync(postId, userId, request);
        return dto != null ? Ok(dto) : Forbid();
    }

    [HttpDelete("posts/{postId:long}")]
    public async Task<IActionResult> Delete(long postId)
    {
        var userId = User.GetUserId();

        var ok = await _service.DeleteAsync(postId, userId);
        return ok ? NoContent() : Forbid();
    }

    [HttpPost("posts/media")]
    public async Task<IActionResult> UploadPostMedia(IFormFile file)
    {
        var url = await _cloudinaryService.UploadPostMediaAsync(
            file,
            "temp/club-posts"
        );

        return Ok(new { url });
    }
}
