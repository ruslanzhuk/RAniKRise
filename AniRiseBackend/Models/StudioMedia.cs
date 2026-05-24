using System.ComponentModel.DataAnnotations.Schema;
namespace AniRiseBackend.Models;

[Table("StudioMedia")]
public class StudioMedia
{
    public long StudioId { get; set; }
    public Studio Studio { get; set; } = null!;

    public long MediaId { get; set; }
    public Media Media { get; set; } = null!;
}