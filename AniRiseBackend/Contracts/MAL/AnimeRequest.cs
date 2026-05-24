namespace AniRiseBackend.Contracts.MAL
{
    public class AnimeRequest
    {
        public string? AnimeId { get; set; }
        public string? AnimeName { get; set; }
        public int Limit { get; set; } = 5;
    }
}