using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;  
using System.Text.Json;  

namespace AniRiseBackend.Models;


[Table("Characters")]
public class Character
{
    public long Id { get; set; }

    public long MalId { get; set; }

    [Required, MaxLength(255)]
    public string Name { get; set; } = null!;

    public string BioJson { get; set; } = "{}";

    [NotMapped]
    public Dictionary<string, string> Bio
    {
        get => JsonSerializer.Deserialize<Dictionary<string, string>>(BioJson) ?? new();
        set => BioJson = JsonSerializer.Serialize(value);
    }

    [NotMapped]
    public string? Description => Bio.TryGetValue("Bio", out var bioText) ? bioText : null;

    public ICollection<CharacterMedia> Media { get; set; } = new List<CharacterMedia>();
    public ICollection<AnimeCharacter> AnimeCharacters { get; set; } = new List<AnimeCharacter>();
}