using System.ComponentModel.DataAnnotations.Schema;
namespace AniRiseBackend.Models;

[Table("CharacterMedias")]
public class CharacterMedia
{
    public long CharacterId { get; set; }
    public Character Character { get; set; } = null!;

    public long MediaId { get; set; }
    public Media Media { get; set; } = null!;
}