using System.ComponentModel.DataAnnotations.Schema;
namespace AniRiseBackend.Models;

[Table("Authors")]
public class Author
{
    public long Id { get; set; }

    [Required, MaxLength(255)]
    public string Name { get; set; } = null!;

    public string? Bio { get; set; }

    public ICollection<AuthorMedia> Media { get; set; } = new List<AuthorMedia>();

    public ICollection<AnimeAuthor> AnimeAuthors { get; set; } = new List<AnimeAuthor>();
}