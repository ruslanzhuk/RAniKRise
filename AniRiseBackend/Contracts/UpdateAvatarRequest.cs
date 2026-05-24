using AniRiseBackend.Models;

namespace AniRiseBackend.Contracts;

public class UpdateAvatarRequest
{
    public string AvatarUrl { get; set; } = null!;
    public int CropX { get; set; }
    public int CropY { get; set; }
    public int CropWidth { get; set; }
    public int CropHeight { get; set; }
}