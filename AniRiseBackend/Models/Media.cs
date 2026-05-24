using System.ComponentModel.DataAnnotations.Schema;
namespace AniRiseBackend.Models;

public enum MediaType
{
    Anime_poster,
    Anime_screen,
    Anime_thriller,
    Character_poster,
    Character_screen,
    Studio_poster,
    Author_poster,
    Anime_poster_inactive,
    Anime_thriller_inactive,
    Character_poster_inactive,
    Author_poster_inactive,
    Studio_poster_inactive,
    Club_post_image,
    Club_post_video,
    Club_post_gif,
    Post_image,
    Post_video,
    Post_gif,
    News_image,
    News_video,
    HomeAnnouncement_image,
    Tech_image,
    Tech_video
}

[Table("Medias")]
public class Media
{
    [Key]
    public long Id { get; set; }

    public MediaType Type { get; set; }

    [Required]
    [MaxLength(255)]
    public string Url { get; set; } = null!;

    public ICollection<AnimeMedia> AnimeMedias { get; set; } = new List<AnimeMedia>();
    public ICollection<AuthorMedia> AuthorMedias { get; set; } = new List<AuthorMedia>();
    public ICollection<CharacterMedia> CharacterMedias { get; set; } = new List<CharacterMedia>();
    public ICollection<StudioMedia> StudioMedias { get; set; } = new List<StudioMedia>();
    public ICollection<ClubMedia> ClubMedias { get; set; } = new List<ClubMedia>();
    public ICollection<ClubPostMedia> ClubPostMedias { get; set; } = new List<ClubPostMedia>();
    public ICollection<PostMedia> PostMedias { get; set; } = new List<PostMedia>();
}