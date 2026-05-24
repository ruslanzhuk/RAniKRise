/* =========================
   ANIME ENUMS
========================= */

export enum AnimeStatus {
  Ongoing = "Ongoing",
  Finished = "Finished",
  Upcoming = "Upcoming",
  Canceled = "Canceled",
}

export enum AnimeType {
  TV = "TV",
  Movie = "Movie",
  OVA = "OVA",
  ONA = "ONA",
  Special = "Special",
  TVShort = "TVShort",
  Music = "Music",
}

export enum AnimeAgeRating {
  G = "G",
  PG = "PG",
  PG13 = "PG13",
  R17 = "R17",
  RPlus = "RPlus",
}

export enum CharacterRole {
  Main = "Main",
  Supporting = "Supporting",
}

export enum AuthorRole {
  Producer = "Producer",
  Director = "Director",
  EpisodeDirector = "EpisodeDirector",
  Storyboard = "Storyboard",
  SoundDirector = "SoundDirector",
  SecondKeyAnimation = "SecondKeyAnimation",
  BackgroundArt = "BackgroundArt",
  KeyAnimation = "KeyAnimation",
  AssistantDirector = "AssistantDirector",
  AnimationDirector = "AnimationDirector",
  Script = "Script",
  SeriesComposition = "SeriesComposition",
  ThemeSongLyrics = "ThemeSongLyrics",
  ThemeSongArrangement = "ThemeSongArrangement",
  ThemeSongComposition = "ThemeSongComposition",
  ThemeSongPerformance = "ThemeSongPerformance",
  Music = "Music",
  DirectorOfPhotography = "DirectorOfPhotography",
  InBetweenAnimation = "InBetweenAnimation",
  AdrDirector = "AdrDirector",
  ProductionManager = "ProductionManager",
  ChiefProducer = "ChiefProducer",
  Editing = "Editing",
  Planning = "Planning",
  OriginalCreator = "OriginalCreator",
  ColorDesign = "ColorDesign",
  CharacterDesign = "CharacterDesign",
  ArtDirector = "ArtDirector",
  AnimationCheck = "AnimationCheck",
  AssistantAnimationDirector = "AssistantAnimationDirector",
  ChiefAnimationDirector = "ChiefAnimationDirector",
  OriginalCharacterDesign = "OriginalCharacterDesign",
  SpecialEffects = "SpecialEffects",
  MechanicalDesign = "MechanicalDesign",
  ProductionAssistant = "ProductionAssistant",
  InsertedSongPerformance = "InsertedSongPerformance",
  Publicity = "Publicity",
  ExecutiveProducer = "ExecutiveProducer",
  DigitalPaint = "DigitalPaint",
  SoundEffects = "SoundEffects",
  AssociateProducer = "AssociateProducer",
  ProductionCoordination = "ProductionCoordination",
  AssistantProducer = "AssistantProducer",
  RecordingEngineer = "RecordingEngineer",
  ColorSetting = "ColorSetting",
  SeriesProductionDirector = "SeriesProductionDirector",
  PlanningProducer = "PlanningProducer",
  Screenplay = "Screenplay",
  Supporting = "Supporting",
}


export interface AnimeAuthorInputDTO {
  authorId: number;
  role: AuthorRole;
}

export interface AnimeCharacterInputDTO {
  characterId: number;
  role: CharacterRole;
}

/* =========================
   LIST ANIME DTO
========================= */
export interface AdminAnimeListItemDTO {
  id: number;
  title: string;
  japaneseTitle?: string;
  type: AnimeType;
  status: AnimeStatus;
  ageRating?: AnimeAgeRating;
  averageScore: number;
  episodes: number;
  rank?: number;
  releaseDate: string;
  genresCount: number;
  studiosCount: number;
  authorsCount: number;
}

/* =========================
   DETAILS ANIME DTO
========================= */
export interface AdminAnimeDetailsDTO {
  id: number;
  title: string;
  japaneseTitle?: string;
  description: string;
  episodes: number;
  type: AnimeType;
  status: AnimeStatus;
  ageRating?: AnimeAgeRating;
  averageScore: number;
  scoredBy?: number;
  rank?: number;
  releaseDate: string;

  genreIds: number[];
  studioIds: number[];
  
  authors: AnimeAuthorInputDTO[];
  characters: AnimeCharacterInputDTO[];
}

/* =========================
   CREATE / UPDATE ANIME DTO
========================= */
export interface CreateAnimeAdminDTO {
  title: string;
  japaneseTitle?: string;
  description: string;
  episodes: number;
  type: AnimeType;
  status: AnimeStatus;
  ageRating?: AnimeAgeRating;
  averageScore: number;
  scoredBy?: number;
  rank?: number;
  releaseDate: string;

  genreIds: number[];
  studioIds: number[];

  authors: AnimeAuthorInputDTO[];
  characters: AnimeCharacterInputDTO[];
}

export interface UpdateAnimeAdminDTO extends CreateAnimeAdminDTO {}

/* =========================
   GENRE DTO
========================= */

export interface AdminGenreDTO {
  id: number;
  name: string;
}

/* =========================
   CLUB DTO
========================= */

export interface ClubSearchDTO {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  membersCount: number;
  createdAt: string;
}

export interface ClubDetailDTO {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  adminName: string;
  imageUrl?: string;
  membersCount: number;
  members: string[];
}

export interface ClubMembershipDTO {
  isMember: boolean;
  isAdmin: boolean;
}

export interface ClubCreateDTO {
  name: string;
  description?: string;
}

export interface ClubUpdateDTO extends ClubCreateDTO {}

/* =========================
   CLUB POST DTO
========================= */

export interface ClubPostDTO {
  id: number;
  clubId: number;
  authorUsername: string;
  content: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  commentsCount: number;
  mediaUrls: string[];
  userReaction?: number | null;
}


export interface ClubPostCreateRequest {
  content: string;
  files?: File[];
}

export interface ClubPostUpdateRequest extends ClubPostCreateRequest {}


// =========================
// ADMIN PROFILE DTO
// =========================
export interface AdminProfileDto {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  role: "Admin" | "Moderator" | "User";
  createdAt: string;
  birthDate?: string;
  gender?: "Male" | "Female";
  visibility: "Public" | "Private";
  themePreference: "light" | "dark";
}

// =========================
// ADMIN Home Announcements DTO
// =========================
export interface HomeAnnouncementDto {
  id: number;
  title: string;
  contentHtml: string;
  imageUrl?: string;
  createdAt: string;
}

export interface CreateHomeAnnouncementRequest {
  title: string;
  contentHtml: string;
  media?: File;
}

export interface UpdateHomeAnnouncementRequest {
  title?: string;
  contentHtml?: string;
  isActive?: boolean;
  media?: File;
}


// =========================
// ADMIN NEWS DTO
// =========================

export interface NewsAdminPreviewDto {
  id: number;
  title: string;
  previewContent: string;
  createdAt: string;
}

export interface NewsAdminDetailsDto {
  id: number;
  title: string;
  previewContent: string;
  contentHtml: string;
  createdAt: string;
  updatedAt?: string;
  authorName: string;
}


// =========================
// MEDIA DTO
// =========================

export enum MediaType {
  Anime_poster = "Anime_poster",
  Anime_screen = "Anime_screen",
  Anime_thriller = "Anime_thriller",

  Character_poster = "Character_poster",
  Character_screen = "Character_screen",

  Studio_poster = "Studio_poster",
  Author_poster = "Author_poster",

  Anime_poster_inactive = "Anime_poster_inactive",
  Anime_thriller_inactive = "Anime_thriller_inactive",

  Character_poster_inactive = "Character_poster_inactive",
  Author_poster_inactive = "Author_poster_inactive",
  Studio_poster_inactive = "Studio_poster_inactive",

  Club_post_image = "Club_post_image",
  Club_post_video = "Club_post_video",
  Club_post_gif = "Club_post_gif",

  Post_image = "Post_image",
  Post_video = "Post_video",
  Post_gif = "Post_gif",

  News_image = "News_image",
  News_video = "News_video",

  HomeAnnouncement_image = "HomeAnnouncement_image",

  Tech_image = "Tech_image",
  Tech_video = "Tech_video",
}


export type MediaEntity = {
  id: number;
  title: string;
  mediaCount: number;
};

export type MediaDto = {
  id: number;
  url: string;
  type: MediaType;
};


// =========================
// COMMENT DTO
// =========================
export type CommentTargetType = "Anime" | "Post" | "ClubPost" | "User";

export interface AdminComment {
  id: number;
  content: string;
  createdAt: string;
  targetType: CommentTargetType;
  targetEntityId?: number | null;
  targetUserId?: string | null;
  targetTitle?: string | null;

  userId: string;
  username: string;
  email: string;
  isBlocked: boolean;

  parentCommentId?: number | null;
  replies: AdminComment[];
}


