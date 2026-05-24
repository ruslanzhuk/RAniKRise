namespace AniRiseBackend.Dtos.Ml;

public class DetectionBoxDTO
    {
        public string Label { get; set; } = string.Empty;
        public float Confidence { get; set; }
        public float X { get; set; }
        public float Y { get; set; }
        public float Width { get; set; }
        public float Height { get; set; }
    }