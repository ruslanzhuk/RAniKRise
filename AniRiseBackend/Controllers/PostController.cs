using AniRiseBackend.Dtos;
using AniRiseBackend.Helpers;
using AniRiseBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniRiseBackend.Controllers;

[ApiController]
[Route("api/posts")]
public class PostController : ControllerBase
{
    private readonly IPostService _postService;

    public PostController(IPostService postService)
    {
        _postService = postService;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] PostCreateDTO dto)
    {
        var userId = User.GetUserId();
        var post = await _postService.CreateAsync(userId, dto);
        return Ok(post);
    }

    // Get all posts for a specific user
    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetUserPosts(Guid userId)
    {
        Guid? viewerId = User.IsLoggedIn() ? User.GetUserId() : null;
        var posts = await _postService.GetUserPostsAsync(userId, viewerId);
        return Ok(posts);
    }

    // Update a post
    [Authorize]
    [HttpPut("{id:long}")]
    public async Task<IActionResult> Update(long id, [FromBody] PostUpdateDTO dto)
    {
        var userId = User.GetUserId();
        var post = await _postService.UpdateAsync(userId, id, dto);
        return post == null ? NotFound() : Ok(post);
    }

    // Delete a post
    [Authorize]
    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id)
    {
        await _postService.DeleteAsync(User.GetUserId(), User.IsAdmin(), id);
        return NoContent();
    }
}
