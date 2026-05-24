namespace AniRiseBackend.Contracts;

public class CreateCollectionRequest
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
}