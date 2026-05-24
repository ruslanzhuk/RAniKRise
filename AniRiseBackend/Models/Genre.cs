using System.ComponentModel.DataAnnotations.Schema;
namespace AniRiseBackend.Models;

[Table("Genres")]
public class Genre
{
    public long Id { get; set; }

    [Required, MaxLength(255)]
    public string Name { get; set; } = null!;

    public ICollection<AnimeGenre> AnimeGenres { get; set; } = new List<AnimeGenre>();
}