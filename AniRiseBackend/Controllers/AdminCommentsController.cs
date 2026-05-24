using AniRiseBackend.Services;
using AniRiseBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniRiseBackend.Controllers;

[ApiController]
[Route("api/admin/comments")]
[Authorize(Roles = "Admin,Moderator")]
public class AdminCommentController : ControllerBase
{
    private readonly IAdminCommentService _service;

    public AdminCommentController(IAdminCommentService service)
    {
        _service = service;
    }

    // GET api/admin/comments?targetType=Anime&targetEntityId=1
    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] CommentTargetType? targetType = null,
        [FromQuery] long? targetEntityId = null,
        [FromQuery] Guid? targetUserId = null)
    {
        var comments = await _service.GetCommentsAsync(targetType, targetEntityId, targetUserId);

        return Ok(comments);
    }

    // GET api/admin/comments/123
    [HttpGet("{commentId:long}")]
    public async Task<IActionResult> GetById(long commentId)
    {
        var comment = await _service.GetCommentByIdAsync(commentId);
        if (comment == null)
            return NotFound(new { Message = $"Comment with id {commentId} not found" });

        return Ok(comment);
    }

    // DELETE api/admin/comments/123
    [HttpDelete("{commentId:long}")]
    public async Task<IActionResult> Delete(long commentId)
    {
        await _service.DeleteCommentAsync(commentId);
        return NoContent();
    }

    // POST api/admin/comments/block-user/00000000-0000-0000-0000-000000000000
    [HttpPost("block-user/{userId:guid}")]
    public async Task<IActionResult> BlockUser(Guid userId)
    {
        await _service.BlockUserAsync(userId);
        return NoContent();
    }
}
