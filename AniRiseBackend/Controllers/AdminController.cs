using AniRiseBackend.Dtos;
using AniRiseBackend.Helpers;
using AniRiseBackend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;


[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly AdminAuthService _adminAuth;

    public AdminController(AdminAuthService adminAuth)
    {
        _adminAuth = adminAuth;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var token = await _adminAuth.LoginAsync(request.Email, request.Password);
            return Ok(new { token });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpGet("verify")]
    public IActionResult Verify()
    {
        try
        {
            var user = HttpContext.User;

            if (!user.IsLoggedIn())
                return Unauthorized(new { message = "Not logged in" });

            if (!user.IsAdmin())
                return Forbid();

            return Ok(new { message = "Admin verified" });
        }
        catch (Exception ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentAdmin()
    {
        var adminId = User.GetUserId();
        var profile = await _adminAuth.GetAdminProfileAsync(adminId);

        if (profile == null) return NotFound(new { message = "Admin not found" });
        return Ok(profile);
    }
}
