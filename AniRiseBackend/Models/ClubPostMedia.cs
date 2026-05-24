using System.ComponentModel.DataAnnotations.Schema;

namespace AniRiseBackend.Models;

[Table("ClubPostMedia")]
public class ClubPostMedia
{
    public long ClubPostId { get; set; }
    public ClubPost ClubPost { get; set; } = null!;

    public long MediaId { get; set; }
    public Media Media { get; set; } = null!;
}
