using AniRiseBackend.Models;

namespace AniRiseBackend.Dtos.Admin;

public class AnimeCharacterInputDTO
{
    public long CharacterId { get; set; }
    public CharacterRole Role { get; set; }
}
