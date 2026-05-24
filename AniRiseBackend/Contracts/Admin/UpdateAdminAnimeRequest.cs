using AniRiseBackend.Dtos.Admin;

namespace AniRiseBackend.Contracts.Admin;

public class UpdateAdminAnimeRequest : CreateAdminAnimeRequest
{
    public List<long> GenreIds { get; set; } = new();
    public List<long> StudioIds { get; set; } = new();

    public List<AnimeAuthorInputDTO> Authors { get; set; } = new();
    public List<AnimeCharacterInputDTO> Characters { get; set; } = new();
}
