namespace AniRiseBackend.Dtos;

public class AuthorSearchDTO
{
    public long Id { get; set; }
    public string FullName { get; set; } = default!;
    public string? ImageUrl { get; set; }
    public DateTime? BirthDate { get; set; }
    public int? WorksCount { get; set; }
}