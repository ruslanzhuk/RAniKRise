using AniRiseBackend.Dtos.Admin;
using AniRiseBackend.Models;
using AniRiseBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

public class UploadMediaRequest
{
    [FromForm(Name = "file")]
    public IFormFile File { get; set; } = default!;

    [FromForm(Name = "type")]
    public MediaType Type { get; set; }
}
