namespace AniRiseBackend.Dtos.Ml;

public class DetectionResultDTO
    {
        public List<DetectionBoxDTO> Detections { get; set; } = new();
        public int TotalDetections => Detections.Count;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }