using System.ComponentModel.DataAnnotations.Schema;
namespace AniRiseBackend.Models;

[Table("AnimeGenres")]
public class AnimeGenre
{
    public long AnimeId { get; set; }
    public Anime Anime { get; set; } = null!;

    public long GenreId { get; set; }
    public Genre Genre { get; set; } = null!;
}