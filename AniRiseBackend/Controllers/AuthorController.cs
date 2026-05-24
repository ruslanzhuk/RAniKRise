using AniRiseBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace AniRiseBackend.Controllers;

[ApiController]
[Route("author")]
public class AuthorController : ControllerBase
{
    private readonly AuthorService _authorService;

    public AuthorController(AuthorService authorService)
    {
        _authorService = authorService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var authors = await _authorService.GetAllAsync(page, pageSize);
        return Ok(authors); 
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetById(long id)
    {
        var author = await _authorService.GetByIdAsync(id);

        return author is null ? NotFound(new { message = "Author not found" }) : Ok(author);
    }

    [HttpGet("anime/{animeId:long}")]
    public async Task<IActionResult> GetByAnime(long animeId)
    {
        var authors = await _authorService.GetByAnimeIdAsync(animeId);
        return Ok(authors);
    }
}