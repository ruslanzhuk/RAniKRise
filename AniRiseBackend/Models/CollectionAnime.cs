using System.ComponentModel.DataAnnotations.Schema;
namespace AniRiseBackend.Models;

[Table("CollectionAnimes")]
public class CollectionAnime
{
    public long CollectionId { get; set; }
    public Collection Collection { get; set; } = null!;

    public long AnimeId { get; set; }
    public Anime Anime { get; set; } = null!;
}