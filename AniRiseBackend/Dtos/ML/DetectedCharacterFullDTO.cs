namespace AniRiseBackend.Dtos.ML;

public class CharacterCardDTO
    {
        public long Id { get; set; }
        public long MalId { get; set; }
        public string Name { get; set; } = null!;
        public string? PosterUrl { get; set; }
        public float Confidence { get; set; }
    }
