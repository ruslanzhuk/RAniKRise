using System.ComponentModel.DataAnnotations.Schema;
namespace AniRiseBackend.Models;

public enum CharacterRole
{
    Main,
    Supporting
}

[Table("AnimeCharacters")]
public class AnimeCharacter
{
    [Key]
    public long Id { get; set; }

    [Required]
    public long AnimeId { get; set; }

    public Anime Anime { get; set; } = null!;

    [Required]
    public long CharacterId { get; set; }

    public Character Character { get; set; } = null!;

    [Required]
    [MaxLength(50)]
    public CharacterRole Role { get; set; }
}