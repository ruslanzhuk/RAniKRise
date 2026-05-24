namespace AniRiseBackend.Dtos.ML;

public class DetectionSummaryResponseDTO
{
    public List<string> Class_Names { get; set; } = new();
    public List<float> Confidence { get; set; } = new();
}
