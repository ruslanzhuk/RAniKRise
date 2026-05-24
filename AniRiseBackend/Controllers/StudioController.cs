using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("studio")]
public class StudioController : ControllerBase
{
    private readonly StudioService _studioService;

    public StudioController(StudioService studioService)
    {
        _studioService = studioService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var studios = await _studioService.GetAllAsync(page, pageSize);
        return Ok(studios);
    }

    [HttpGet("mini")]
    public async Task<IActionResult> GetAllMini()
    {
        var studios = await _studioService.GetAllMiniAsync();
        return Ok(studios);
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetById(long id)
    {
        var studio = await _studioService.GetByIdAsync(id);

        return studio is null ? NotFound(new { message = "Studio not found" }) : Ok(studio);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] string query,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest(new { message = "Query cannot be empty" });

        var studios = await _studioService.SearchMiniAsync(query, page, pageSize);
        return Ok(studios);
    }

}