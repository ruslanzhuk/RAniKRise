using Microsoft.AspNetCore.Mvc;
using AniRiseBackend.Services;

namespace AniRiseBackend.Controllers;

[ApiController]
[Route("api/character")]
public class CharacterController : ControllerBase
{
    private readonly CharacterService _characterService;

    public CharacterController(CharacterService characterService)
    {
        _characterService = characterService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null
    )
    {
        var characters = await _characterService.GetAllAsync(page, pageSize, search);
        return Ok(characters);
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetById(long id)
    {
        var character = await _characterService.GetByIdAsync(id);
        
        return character is null ? NotFound(new { message = "Character not found" }) : Ok(character);
    }

    [HttpGet("alphabet")]
    public async Task<IActionResult> GetAlphabetCounts()
    {
        var counts = await _characterService.GetAlphabetCountsAsync();
        return Ok(counts);
    }

    [HttpGet("letter/{letter}")]
    public async Task<IActionResult> GetByLetter(
        string letter,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20
    )
    {
        var characters = await _characterService.GetByAlphabetLetterAsync(letter, page, pageSize);
        return Ok(characters);
    }

    [HttpGet("anime/{animeId}")]
    public async Task<IActionResult> GetByAnime(long animeId)
    {
        var (main, supporting) = await _characterService.GetCharactersByAnimeAsync(animeId);
        return Ok(new
        {
            MainCharacters = main,
            SupportingCharacters = supporting
        });
    }

}