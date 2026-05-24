using AniRiseBackend.Dtos;
using AniRiseBackend.Dtos.Admin;

namespace AniRiseBackend.Contracts.Admin;

public class GetAdminAnimeResponse
{
    public List<AdminAnimeListItemDTO> Items { get; set; } = [];
    public int TotalCount { get; set; }
}
