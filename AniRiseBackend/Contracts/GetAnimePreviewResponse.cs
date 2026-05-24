using System.Collections.Generic;
using AniRiseBackend.Contracts.Jikan;

namespace AniRiseBackend.Dtos;

public record GetAnimePreviewResponse(List<AnimePreviewContract> Animes);
