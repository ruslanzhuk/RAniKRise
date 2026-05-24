namespace AniRiseBackend.Dtos;

public class ClubPostDetailDTO : ClubPostDTO
{
    public List<CommentDTO> Comments { get; set; } = new();
}
