using System.ComponentModel.DataAnnotations;

namespace AniRiseBackend.Dtos;

public class ClubPostReactionRequest
{
    [Required]
    public ReactionType Reaction { get; set; }
}
