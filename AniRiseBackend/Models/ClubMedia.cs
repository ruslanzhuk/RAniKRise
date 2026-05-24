using System.ComponentModel.DataAnnotations.Schema;

namespace AniRiseBackend.Models;

[Table("ClubMedia")]
public class ClubMedia
{
    public long ClubId { get; set; }
    public Club Club { get; set; } = null!;

    public long MediaId { get; set; }
    public Media Media { get; set; } = null!;
}
