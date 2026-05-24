using AniRiseBackend.Dtos.ML;
using Microsoft.AspNetCore.Http;

namespace AniRiseBackend.Services.ML
{
    public interface IDetectionClient
    {
        Task<List<CharacterCardDTO>> DetectAndResolveAsync(IFormFile image);
    }
}
