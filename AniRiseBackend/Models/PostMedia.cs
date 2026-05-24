using System.ComponentModel.DataAnnotations.Schema;

namespace AniRiseBackend.Models;

[Table("PostMedia")]
public class PostMedia
{
    public long PostId { get; set; }
    public Post Post { get; set; } = null!;

    public long MediaId { get; set; }
    public Media Media { get; set; } = null!;
}
