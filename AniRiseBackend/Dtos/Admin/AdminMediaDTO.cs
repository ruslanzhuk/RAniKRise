using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos.Admin;

public class AdminMediaDto
{
    public long Id { get; set; }
    public string Url { get; set; } = null!;
    public MediaType Type { get; set; }
}
