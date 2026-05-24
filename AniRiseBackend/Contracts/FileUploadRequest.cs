namespace AniRiseBackend.Contracts;

public class FileUploadRequest
{
    public IFormFile File { get; set; } = null!;
}
