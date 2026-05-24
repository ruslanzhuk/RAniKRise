using AniRiseBackend.Dtos.ML;
using AniRiseBackend.Services.ML;
using Microsoft.AspNetCore.Mvc;

namespace AniRiseBackend.Controllers.ML;

[ApiController]
[Route("api/ml/detection")]
public class DetectionController : ControllerBase
{
    private readonly IDetectionClient _detectionClient;

    public DetectionController(IDetectionClient detectionClient)
    {
        _detectionClient = detectionClient;
    }

    [HttpPost("characters")]
    public async Task<ActionResult<List<CharacterCardDTO>>> DetectCharacters(IFormFile image)
    {
        var result = await _detectionClient.DetectAndResolveAsync(image);
        return Ok(result);
    }
}
