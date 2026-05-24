using AniRiseBackend.Dtos;

public class SearchResultDTO
{
    public List<AnimeSearchDTO> Animes { get; set; } = new();
    public List<CharacterSearchDTO> Characters { get; set; } = new();
    public List<UserSearchDTO> Users { get; set; } = new();
    public List<NewsSearchDTO>? News { get; set; } = new();
    public List<StudioSearchDTO> Studios { get; set; } = new();
    public List<ClubSearchDTO> Clubs { get; set; } = new();
    public List<AuthorSearchDTO> Authors { get; set; } = new();
    public int TotalResults { get; set; }
}