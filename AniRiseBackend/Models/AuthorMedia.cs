using System.ComponentModel.DataAnnotations.Schema;
namespace AniRiseBackend.Models;

[Table("AuthorMedia")]
public class AuthorMedia
{
    public long AuthorId { get; set; }
    public Author Author { get; set; } = null!;

    public long MediaId { get; set; }
    public Media Media { get; set; } = null!;
}