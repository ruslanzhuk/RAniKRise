using AniRiseBackend.Services;
using AniRiseBackend.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AniRiseBackend.Helpers;

namespace AniRiseBackend.Controllers;

[ApiController]
[Route("api/collections")]
public class CollectionController : ControllerBase
{
    private readonly CollectionService _service;

    public CollectionController(CollectionService service)
    {
        _service = service;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreateCollectionRequest req)
    {
        try
        {
            var userId = User.GetUserId();
            var result = await _service.CreateAsync(
                userId,
                req.Name,
                req.Description
            );

            return Ok(result);
        }
        catch (DuplicateCollectionException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> My()
        => Ok(await _service.GetUserCollectionsAsync(User.GetUserId()));

    [Authorize]
    [HttpGet("favorites")]
    public async Task<IActionResult> Favorites()
        => Ok(await _service.GetFavoritesAsync(User.GetUserId()));

    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> UserCollections(Guid userId)
        => Ok(await _service.GetUserCollectionsPublicAsync(userId));

    [Authorize]
    [HttpPost("{collectionId}/anime/{animeId}")]
    public async Task<IActionResult> Add(long collectionId, long animeId)
    {
        await _service.AddAnimeAsync(collectionId, animeId, User.GetUserId());
        return Ok();
    }

    [Authorize]
    [HttpDelete("{collectionId}/anime/{animeId}")]
    public async Task<IActionResult> Remove(long collectionId, long animeId)
    {
        await _service.RemoveAnimeAsync(collectionId, animeId, User.GetUserId());
        return Ok();
    }

    [Authorize]
    [HttpDelete("{collectionId}")]
    public async Task<IActionResult> Delete(long collectionId)
    {
        await _service.DeleteAsync(collectionId, User.GetUserId());
        return Ok();
    }

    [Authorize]
    [HttpPost("sync-anime")]
    public async Task<IActionResult> SyncAnimeCollections(
        [FromBody] SyncAnimeCollectionsRequest request
    )
    {
        var userId = User.GetUserId();
        await _service.SyncAnimeCollectionsAsync(
            userId,
            request.AnimeId,
            request.CollectionIds
        );

        return NoContent();
    }
}

