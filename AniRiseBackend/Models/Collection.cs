using System.ComponentModel.DataAnnotations.Schema;

namespace AniRiseBackend.Models;

[Table("Collections")]
public class Collection
{
    public long Id { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime CreatedAt { get; set; }

    public ICollection<CollectionAnime> CollectionAnimes { get; set; } = new List<CollectionAnime>();
}