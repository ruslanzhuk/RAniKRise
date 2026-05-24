using System.ComponentModel.DataAnnotations.Schema;
namespace AniRiseBackend.Models;

[Table("AnimeMedias")]
public class AnimeMedia
{
    public long AnimeId { get; set; }
    public Anime Anime { get; set; } = null!;

    public long MediaId { get; set; }
    public Media Media { get; set; } = null!;
}