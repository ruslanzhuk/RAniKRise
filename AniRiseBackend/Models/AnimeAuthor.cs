using System.ComponentModel.DataAnnotations.Schema;
namespace AniRiseBackend.Models;

public enum AuthorRole
{
    Producer,
    Director,
    EpisodeDirector,
    Storyboard,
    SoundDirector,
    SecondKeyAnimation,
    BackgroundArt,
    KeyAnimation,
    AssistantDirector,
    AnimationDirector,
    Script,
    SeriesComposition,
    ThemeSongLyrics,
    ThemeSongArrangement,
    ThemeSongComposition,
    ThemeSongPerformance,
    Music,
    DirectorOfPhotography,
    InBetweenAnimation,
    AdrDirector,
    ProductionManager,
    ChiefProducer,
    Editing,
    Planning,
    OriginalCreator,
    ColorDesign,
    CharacterDesign,
    ArtDirector,
    AnimationCheck,
    AssistantAnimationDirector,
    ChiefAnimationDirector,
    OriginalCharacterDesign,
    SpecialEffects,
    MechanicalDesign,
    ProductionAssistant,
    InsertedSongPerformance,
    Publicity,
    ExecutiveProducer,
    DigitalPaint,
    SoundEffects,
    AssociateProducer,
    ProductionCoordination,
    AssistantProducer,
    RecordingEngineer,
    ColorSetting,
    SeriesProductionDirector,
    PlanningProducer,
    Screenplay,
    Supporting,
}

[Table("AnimeAuthor")]
public class AnimeAuthor
{
    [Key]
    public long Id { get; set; }

    [Required]
    public long AnimeId { get; set; }

    public Anime Anime { get; set; } = null!;

    [Required]
    public long AuthorId { get; set; }

    public Author Author { get; set; } = null!;

    public AuthorRole Role { get; set; }
}