using AniRiseBackend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AniRiseBackend.Dtos;
using System.Security.Claims;
using AniRiseBackend.Contracts;
using AniRiseBackend.Helpers;


namespace AniRiseBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var user = await _userService.RegisterAsync(request.Username, request.Email, request.Password);
            return Ok(new { user.Id, user.Username, user.Email, user.Role, user.CreatedAt });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        Console.WriteLine($"Received: Email={request.Email}, Password={request.Password}");
        try
        {
            var token = await _userService.LoginAsync(request.Email, request.Password);
            return Ok(new { Token = token });
        }
        catch (Exception ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromQuery] string token)
    {
        try
        {
            await _userService.ConfirmEmailAsync(token);
            return Ok(new { message = "Email confirmed successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.GetUserId();
        var userDto = await _userService.GetUserByIdAsync(userId);
        return Ok(userDto);
    }

    [HttpGet("check-username")]
    public async Task<IActionResult> CheckUsername([FromQuery] string username)
    {
        if (string.IsNullOrWhiteSpace(username))
            return BadRequest(new { message = "Username must be provided." });

        var exists = await _userService.IsUsernameTakenAsync(username);
        return Ok(new { isTaken = exists });
    }


    [Authorize]
    [HttpPut("update")]
    public async Task<IActionResult> UpdateUser([FromBody] UpdateUserRequest request)
    {
        var userId = User.GetUserId();
        var updatedUser = await _userService.UpdateUserAsync(userId, request);
        return Ok(updatedUser);
    }

    [Authorize]
    [HttpGet("stats")]
    public async Task<IActionResult> GetUserStats()
    {
        var userId = User.GetUserId();
        var stats = await _userService.GetUserStatsAsync(userId);
        return Ok(stats);
    }

    [HttpGet("public/{userId}")]
    public async Task<IActionResult> GetPublicProfile(Guid userId)
    {
        var profile = await _userService.GetPublicProfileAsync(userId);
        return profile == null
            ? NotFound(new { message = "User not found." })
            : Ok(profile);
    }

    [HttpGet("public/by-username/{username}")]
    public async Task<IActionResult> GetPublicProfileByUsername(string username)
    {
        if (string.IsNullOrWhiteSpace(username))
            return BadRequest(new { message = "Username must be provided." });

        var user = await _userService.GetPublicProfileByUsernameAsync(username);
        return user == null
            ? NotFound(new { message = "User not found." })
            : Ok(user);
    }
    
    [Authorize]
    [HttpPut("avatar")]
    public async Task<IActionResult> UpdateAvatar([FromBody] UpdateAvatarRequest request)
    {
        var userId = User.GetUserId();
        var user = await _userService.UpdateAvatarAsync(userId, request);
        return Ok(new { user.AvatarUrl });
    }


    [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = User.GetUserId();
        var result = await _userService.UpdateProfileAsync(userId, request);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("email/change")]
    public async Task<IActionResult> RequestEmailChange(
        [FromBody] RequestEmailChangeDto dto)
    {
        var userId = User.GetUserId();
        await _userService.RequestEmailChangeAsync(userId, dto.NewEmail);
        return Ok(new { message = "Confirmation codes sent" });
    }

    [Authorize]
    [HttpGet("email/status")]
    public async Task<IActionResult> GetEmailChangeStatus()
    {
        var userId = User.GetUserId();
        var status = await _userService.GetEmailChangeStatusAsync(userId);
        return Ok(status);
    }

    [Authorize]
    [HttpPost("email/cancel")]
    public async Task<IActionResult> CancelEmailChange()
    {
        var userId = User.GetUserId();
        await _userService.CancelEmailChangeAsync(userId);

        return Ok(new { message = "Email change process reset" });
    }

    [Authorize]
    [HttpPost("email/confirm")]
    public async Task<IActionResult> ConfirmEmailChange(
        [FromBody] ConfirmEmailChangeDto dto)
    {
        var userId = User.GetUserId();
        await _userService.ConfirmEmailChangeAsync(userId, dto.Token);
        return Ok(new { message = "Email change confirmed" });
    }

    [HttpPost("password/reset/request")]
    public async Task<IActionResult> RequestPasswordReset(
        [FromBody] RequestPasswordResetDto dto)
    {
        await _userService.RequestPasswordResetAsync(dto.Email);
        return Ok(new { message = "Password reset email sent" });
    }

    [HttpPost("password/reset/confirm")]
    public async Task<IActionResult> ConfirmPasswordReset(
        [FromBody] ConfirmPasswordResetDto dto)
    {
        await _userService.ConfirmPasswordResetAsync(dto.Token, dto.NewPassword);
        return Ok(new { message = "Password changed successfully" });
    }

    [Authorize]
    [HttpPut("theme")]
    public async Task<IActionResult> UpdateTheme([FromBody] UpdateThemeRequest dto)
    {
        var userId = User.GetUserId();
        await _userService.UpdateThemeAsync(userId, dto.ThemePreference);
        return NoContent();
    }

    
    [HttpGet("list")]
    public async Task<IActionResult> GetUsers(
        [FromQuery] string? query = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] bool sortByCollection = false,
        CancellationToken ct = default)
    {
        var users = await _userService.GetUsersAsync(query, page, pageSize, sortByCollection, ct);
        return Ok(users);
    }

    [Authorize]
    [HttpPost("delete")]
    public async Task<IActionResult> DeleteAccount([FromBody] DeleteAccountRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            await _userService.DeleteAccountAsync(userId, request.Password);
            return Ok(new { message = "Account deleted successfully." });
        }
        catch (UnauthorizedAccessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }
}