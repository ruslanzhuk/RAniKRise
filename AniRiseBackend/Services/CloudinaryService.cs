using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace AniRiseBackend.Services;

public class CloudinaryService
{
    private readonly Cloudinary _cloudinary;
    private const long MaxVideoSize = 100 * 1024 * 1024; // 100 MB

    public CloudinaryService(IConfiguration config)
    {
        var account = new Account(
            config["Cloudinary:CloudName"],
            config["Cloudinary:ApiKey"],
            config["Cloudinary:ApiSecret"]
        );
        _cloudinary = new Cloudinary(account);
    }

    public async Task<string> UploadAvatarAsync(string base64Image, string userId, int cropX, int cropY, int cropWidth, int cropHeight)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription($"data:image/png;base64,{base64Image}"),
            PublicId = $"avatars/{userId}_{DateTime.UtcNow.Ticks}",
            Folder = "avatars",
            Overwrite = true,
            Transformation = new Transformation()
                .Crop("crop")
                .X(cropX)
                .Y(cropY)
                .Width(cropWidth)
                .Height(cropHeight)
        };

        var result = await _cloudinary.UploadAsync(uploadParams);
        return result.SecureUrl.ToString();
    }

    public async Task<string> UploadFileAsync(IFormFile file, string folder)
    {
        await using var stream = file.OpenReadStream();

        var uploadParams = new CloudinaryDotNet.Actions.ImageUploadParams
        {
            File = new CloudinaryDotNet.FileDescription(file.FileName, stream),
            Folder = folder
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        return uploadResult.SecureUrl.AbsoluteUri;
    }

    public async Task<string> UploadGifAsync(IFormFile file, string folder)
    {
        await using var stream = file.OpenReadStream();
        var uploadParams = new RawUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = folder
        };
        var result = await _cloudinary.UploadAsync(uploadParams);
        return result.SecureUrl.AbsoluteUri;
    }


    public async Task<string> UploadVideoAsync(IFormFile file, string folder)
    {
        await using var stream = file.OpenReadStream();

        var uploadParams = new VideoUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = folder
        };

        var result = await _cloudinary.UploadAsync(uploadParams);
        return result.SecureUrl.AbsoluteUri;
    }

    public async Task<string> UploadPostMediaAsync(IFormFile file, string folder)
    {
        if (file.ContentType.StartsWith("video/") && file.Length > MaxVideoSize)
        {
            throw new InvalidOperationException(
                $"Video '{file.FileName}' is too large. Maximum allowed size is {MaxVideoSize / (1024 * 1024)} MB."
            );
        }

        if (file.ContentType == "image/gif")
            return await UploadGifAsync(file, folder);

        if (file.ContentType.StartsWith("image/"))
            return await UploadFileAsync(file, folder);

        if (file.ContentType.StartsWith("video/"))
            return await UploadVideoAsync(file, folder);

        throw new InvalidOperationException("Unsupported media type");
    }
}
