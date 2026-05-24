using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

public class PostCreateDTO
{
    [Required]
    [MaxLength(1000)]
    public string Content { get; set; } = null!;

    public List<IFormFile>? MediaFiles { get; set; }
}
