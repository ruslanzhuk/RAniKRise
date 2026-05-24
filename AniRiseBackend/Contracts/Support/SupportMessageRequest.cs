using System.ComponentModel.DataAnnotations;

namespace AniRiseBackend.Contracts.Support;

public class SupportMessageRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(10)]
    public string Message { get; set; } = string.Empty;
}
