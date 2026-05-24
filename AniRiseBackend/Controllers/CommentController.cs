using AniRiseBackend.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AniRiseBackend.Services;
using AniRiseBackend.Helpers;
using System.Security.Claims;
using AniRiseBackend.Models;

namespace AniRiseBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    // ---------------- GET ----------------
    [HttpGet("{targetType}/{targetId:long}")]
    public async Task<IActionResult> GetComments(CommentTargetType targetType, long targetId)
    {
        try
        {
            if (targetType == CommentTargetType.User)
                return BadRequest(new { message = "For users use /User/{userId}" });

            Guid? currentUserId = null;
            if (User.Identity?.IsAuthenticated ?? false)
            {
                currentUserId = User.GetUserId();
            }

            var comments = await _commentService.GetCommentsAsync(targetType, targetId, currentUserId);
            return Ok(comments);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet("User/{userId:guid}")]
    public async Task<IActionResult> GetCommentsForUser(Guid userId)
    {
        try
        {
            Guid? currentUserId = null;
            if (User.Identity?.IsAuthenticated ?? false)
                currentUserId = User.GetUserId();

            var comments = await _commentService.GetCommentsForUserAsync(userId, currentUserId);
            return Ok(comments);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    // ---------------- POST ----------------
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCommentRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            var comment = await _commentService.CreateCommentAsync(userId, request);
            return Ok(comment);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    // ---------------- PUT ----------------
    [Authorize]
    [HttpPut("{id:long}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateCommentRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            var comment = await _commentService.UpdateCommentAsync(userId, id, request.Content);

            if (comment == null)
                return NotFound(new { message = "Comment not found." });

            return Ok(comment);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    // ---------------- DELETE ----------------
    [Authorize]
    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id)
    {
        try
        {
            var userId = User.GetUserId();
            var success = await _commentService.DeleteCommentAsync(userId, id);

            if (!success)
                return NotFound(new { message = "Comment not found." });

            return Ok(new { message = "Comment deleted successfully." });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("{id:long}/reaction")]
    public async Task<IActionResult> React(long id, [FromBody] CommentReactionRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            var comment = await _commentService.ReactCommentAsync(userId, id, (int)request.Reaction);
            return Ok(new { message = "Reaction saved successfully." });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }
}
