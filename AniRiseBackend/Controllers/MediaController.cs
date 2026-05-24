using AniRiseBackend.Models;
using AniRiseBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniRiseBackend.Controllers;

[Authorize]
[ApiController]
[Route("api/admin/media")]
public class MediaController : ControllerBase
{
    private readonly IMediaService _mediaService;
    private readonly CloudinaryService _cloudinary;

    public MediaController(IMediaService mediaService, CloudinaryService cloudinary)
    {
        _mediaService = mediaService;
        _cloudinary = cloudinary;
    }

    [HttpGet("{entity}/{entityId:long}")]
    public async Task<IActionResult> GetMedia(string entity, long entityId)
    {
        var result = await _mediaService.GetEntityMediaAsync(entity, entityId);
        return Ok(result);
    }

    [HttpPost("{entity}/{entityId:long}")]
    public async Task<IActionResult> UploadMedia(
        string entity,
        long entityId,
        [FromForm] UploadMediaRequest request)
    {
        var url = await _cloudinary.UploadPostMediaAsync(request.File, $"media/{entity}");
        var media = await _mediaService.AttachMediaAsync(entity, entityId, request.Type, url);
        return Ok(media);
    }

    [HttpPut("{mediaId:long}/type")]
    public async Task<IActionResult> UpdateType(long mediaId, [FromQuery] MediaType type)
    {
        await _mediaService.UpdateMediaTypeAsync(mediaId, type);
        return Ok();
    }

    [HttpDelete("{mediaId:long}")]
    public async Task<IActionResult> Delete(long mediaId)
    {
        await _mediaService.DeleteMediaAsync(mediaId);
        return Ok();
    }
}
