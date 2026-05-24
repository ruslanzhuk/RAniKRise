namespace AniRiseBackend.Dtos.ML;

public class DetectedCharacterDTO
{
    public int CharacterId { get; set; }
    public string Name { get; set; } = null!;
    public float Confidence { get; set; }
}
