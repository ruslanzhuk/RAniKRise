using AniRiseBackend.Contracts;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AniRiseBackend.Services;


namespace AniRiseBackend.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController : ControllerBase
{
    private readonly SearchService _service;

    public SearchController(SearchService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Search(
        [FromQuery] SearchType type = SearchType.All,
        [FromQuery] string query = "",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest(new { message = "Query cannot be empty." });

        var result = await _service.SearchAsync(type, query, page, pageSize, ct);
        return Ok(result);
    }
}
