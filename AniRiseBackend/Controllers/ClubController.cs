using Microsoft.AspNetCore.Mvc;
using AniRiseBackend.Services;
using AniRiseBackend.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace AniRiseBackend.Controllers;

[ApiController]
[Route("api/clubs")]
public class ClubController : ControllerBase
{
    private readonly ClubService _clubService;

    public ClubController(ClubService clubService)
    {
        _clubService = clubService;
    }

    // GET /api/clubs
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _clubService.GetAllAsync());
    }

    [HttpGet("query")]
    public async Task<IActionResult> GetFiltered([FromQuery] ClubRequestParams query)
    {
        var clubs = await _clubService.GetAllFilteredAsync(query);
        return Ok(clubs);
    }

    // GET /api/clubs/{id}
    [HttpGet("{id:long}")]
    [Authorize]
    public async Task<IActionResult> GetById(long id)
    {
        var userId = User.GetUserId();
        var club = await _clubService.GetByIdAsync(id, userId);
        return club is null ? NotFound() : Ok(club);
    }

    // GET /api/clubs/user/{userId}
    [HttpGet("user/{userId:guid}")]
    [Authorize]
    public async Task<IActionResult> GetUserClubs(Guid userId)
    {
        var clubs = await _clubService.GetUserClubsAsync(userId);
        return Ok(clubs);
    }

    // POST /api/clubs
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] ClubCreateRequest request)
    {
        var adminId = User.GetUserId(); 

        var club = await _clubService.CreateAsync(request, adminId);
        return CreatedAtAction(nameof(GetById), new { id = club.Id }, club);
    }

    // PUT /api/clubs/{id}
    [HttpPut("{id:long}")]
    [Authorize]
    public async Task<IActionResult> Update(long id, [FromBody] ClubUpdateRequest request)
    {
        // get logged-in user's ID
        var userId = User.GetUserId();

        return await _clubService.UpdateAsync(id, request, userId)
            ? NoContent()
            : Forbid(); // use Forbid() if user is not admin
    }

    // DELETE /api/clubs/{id}
    [HttpDelete("{id:long}")]
    [Authorize]
    public async Task<IActionResult> Delete(long id)
    {
        return await _clubService.DeleteAsync(id)
            ? NoContent()
            : NotFound();
    }

    // POST /api/clubs/{clubId}/join/{userId}
    [HttpPost("{clubId:long}/join")]
    [Authorize]
    public async Task<IActionResult> JoinClub(long clubId)
    {
        var userId = User.GetUserId();
        var ok = await _clubService.JoinClubAsync(clubId, userId);
        return ok ? Ok() : BadRequest("User already in this club.");
    }

    [HttpPost("{clubId:long}/leave")]
    [Authorize]
    public async Task<IActionResult> LeaveClub(long clubId)
    {
        var userId = User.GetUserId();
        var ok = await _clubService.LeaveClubAsync(clubId, userId);
        return ok ? Ok() : BadRequest("User is not a member of this club.");
    }

    [HttpGet("admin/me")]
    [Authorize]
    public async Task<IActionResult> GetMyClubs()
    {
        var adminId = User.GetUserId();
        var clubs = await _clubService.GetAdminClubsAsync(adminId);
        return Ok(clubs);
    }
}
