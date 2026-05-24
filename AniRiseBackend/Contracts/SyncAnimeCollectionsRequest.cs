namespace AniRiseBackend.Contracts;

public class SyncAnimeCollectionsRequest
{
    public long AnimeId { get; set; }
    public List<long> CollectionIds { get; set; } = new();
}
