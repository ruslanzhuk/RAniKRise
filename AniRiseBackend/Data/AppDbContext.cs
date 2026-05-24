using Microsoft.EntityFrameworkCore;
using AniRiseBackend.Models;
using System.Text.Json;
using AniRiseBackend.Converters;


namespace AniRiseBackend.Data
{
    public class AppDbContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public AppDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            var serverVersion = ServerVersion.AutoDetect(connectionString);

            optionsBuilder.UseMySql(connectionString, serverVersion);
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Anime> Animes { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Studio> Studios { get; set; }
        public DbSet<Author> Authors { get; set; }
        public DbSet<Media> Medias { get; set; }
        public DbSet<Character> Characters { get; set; }
        public DbSet<Comment> Comments { get; set; } = null!;
        public DbSet<Post> Posts { get; set; } = null!;
        public DbSet<WatchStatus> WatchStatuses { get; set; } = null!;

        public DbSet<AnimeCharacter> AnimeCharacters { get; set; }
        public DbSet<AnimeAuthor> AnimeAuthors { get; set; }
        public DbSet<AnimeGenre> AnimeGenres { get; set; }
        public DbSet<AnimeStudio> AnimeStudios { get; set; }
        public DbSet<AnimeMedia> AnimeMedias { get; set; }

        public DbSet<AuthorMedia> AuthorMedias { get; set; }

        public DbSet<CharacterMedia> CharacterMedias { get; set; }

        public DbSet<Collection> Collections { get; set; } = null!;
        public DbSet<CollectionAnime> CollectionAnimes { get; set; } = null!;

        public DbSet<Rating> Ratings { get; set; } = null!;

        public DbSet<PostReaction> PostReactions { get; set; } = null!;

        public DbSet<StudioMedia> StudioMedias { get; set; } = null!;

        public DbSet<UserAnimeStatus> UserAnimeStatuses { get; set; } = null!;
        
        public DbSet<CommentReaction> CommentReactions { get; set; } = null!;

        public DbSet<UserClub> UserClubs { get; set; } = null!;

        public DbSet<Club> Clubs { get; set; } = null!;
        public DbSet<ClubPost> ClubPosts { get; set; } = null!;
        public DbSet<ClubPostReaction> ClubPostReactions { get; set; } = null!;
        public DbSet<ClubMedia> ClubMedias { get; set; } = null!;
        public DbSet<ClubPostMedia> ClubPostMedias { get; set; } = null!;
        public DbSet<News> News { get; set; } = null!;
        public DbSet<NewsReaction> NewsReactions { get; set; } = null!;
        public DbSet<Friendship> Friendships { get; set; } = null!;
        public DbSet<Notification> Notifications { get; set; } = null!;
        public DbSet<PostMedia> PostMedias { get; set; } = null!;
        public DbSet<SupportMessage> SupportMessages { get; set; }
        public DbSet<HomeAnnouncement> HomeAnnouncements { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AnimeAuthor>().ToTable("AnimeAuthor");

            // Registering the conversion Dictionary<string,string> -> JSON
            modelBuilder.Entity<Character>()
                .Property(c => c.Bio)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, new JsonSerializerOptions()),
                    v => JsonSerializer.Deserialize<Dictionary<string, string>>(v, new JsonSerializerOptions())
                        ?? new Dictionary<string, string>()
                )
                .HasColumnType("JSON");

            // Composite keys and relationships for many-to-many join tables

            // ---------------------------------------------
            // ---------------------------------------------
            // AnimeGenre
            // ---------------------------------------------
            // ---------------------------------------------

            modelBuilder.Entity<AnimeGenre>()
                .HasKey(ag => new { ag.AnimeId, ag.GenreId });

            modelBuilder.Entity<AnimeGenre>()
                .HasOne(ag => ag.Anime)
                .WithMany(a => a.AnimeGenres)
                .HasForeignKey(ag => ag.AnimeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AnimeGenre>()
                .HasOne(ag => ag.Genre)
                .WithMany(g => g.AnimeGenres)
                .HasForeignKey(ag => ag.GenreId)
                .OnDelete(DeleteBehavior.Restrict);

            // ---------------------------------------------
            // ---------------------------------------------
            // AnimeStudio
            // ---------------------------------------------
            // ---------------------------------------------

            modelBuilder.Entity<AnimeStudio>()
                .HasKey(asd => new { asd.AnimeId, asd.StudioId });

            modelBuilder.Entity<AnimeStudio>()
                .HasOne(asd => asd.Anime)
                .WithMany(a => a.AnimeStudios)
                .HasForeignKey(asd => asd.AnimeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AnimeStudio>()
                .HasOne(asd => asd.Studio)
                .WithMany(s => s.AnimeStudios)
                .HasForeignKey(asd => asd.StudioId)
                .OnDelete(DeleteBehavior.Restrict);

            // ---------------------------------------------
            // ---------------------------------------------
            // AnimeMedia
            // ---------------------------------------------
            // ---------------------------------------------

            modelBuilder.Entity<AnimeMedia>()
                .HasKey(am => new { am.AnimeId, am.MediaId });

            modelBuilder.Entity<AnimeMedia>()
                .HasOne(am => am.Anime)
                .WithMany(a => a.Media)
                .HasForeignKey(am => am.AnimeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AnimeMedia>()
                .HasOne(am => am.Media)
                .WithMany(m => m.AnimeMedias)
                .HasForeignKey(am => am.MediaId)
                .OnDelete(DeleteBehavior.Restrict);

            // ---------------------------------------------
            // ---------------------------------------------
            // AnimeAuthor
            // ---------------------------------------------
            // ---------------------------------------------

            modelBuilder.Entity<AnimeAuthor>()
                .HasKey(aa => aa.Id);

            modelBuilder.Entity<AnimeAuthor>()
                .HasOne(aa => aa.Anime)
                .WithMany(a => a.AnimeAuthors)
                .HasForeignKey(aa => aa.AnimeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AnimeAuthor>()
                .HasOne(aa => aa.Author)
                .WithMany(a => a.AnimeAuthors)
                .HasForeignKey(aa => aa.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<AnimeAuthor>()
            .HasIndex(aa => new { aa.AnimeId, aa.Role });

            // ---------------------------------------------
            // ---------------------------------------------
            // AnimeCharacter
            // ---------------------------------------------
            // ---------------------------------------------

            modelBuilder.Entity<AnimeCharacter>()
                .HasKey(ac => ac.Id);

            modelBuilder.Entity<AnimeCharacter>()
                .HasOne(ac => ac.Anime)
                .WithMany(a => a.AnimeCharacters)
                .HasForeignKey(ac => ac.AnimeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AnimeCharacter>()
                .HasOne(ac => ac.Character)
                .WithMany(c => c.AnimeCharacters)
                .HasForeignKey(ac => ac.CharacterId)
                .OnDelete(DeleteBehavior.Restrict);
            
            modelBuilder.Entity<AnimeCharacter>()
            .HasIndex(ac => new { ac.AnimeId, ac.Role });

            // ---------------------------------------------
            // ---------------------------------------------
            // AuthorMedia
            // ---------------------------------------------
            // ---------------------------------------------

            modelBuilder.Entity<AuthorMedia>()
                .HasKey(am => new { am.AuthorId, am.MediaId });

            modelBuilder.Entity<AuthorMedia>()
                .HasOne(am => am.Author)
                .WithMany(a => a.Media)
                .HasForeignKey(am => am.AuthorId);

            modelBuilder.Entity<AuthorMedia>()
                .HasOne(am => am.Media)
                .WithMany(m => m.AuthorMedias)
                .HasForeignKey(am => am.MediaId);

            // ---------------------------------------------
            // ---------------------------------------------
            // CharacterMedia
            // ---------------------------------------------
            // ---------------------------------------------

            modelBuilder.Entity<CharacterMedia>()
                .HasKey(cm => new { cm.CharacterId, cm.MediaId });

            modelBuilder.Entity<CharacterMedia>()
                .HasOne(cm => cm.Character)
                .WithMany(c => c.Media)
                .HasForeignKey(cm => cm.CharacterId);

            modelBuilder.Entity<CharacterMedia>()
                .HasOne(cm => cm.Media)
                .WithMany(m => m.CharacterMedias)
                .HasForeignKey(cm => cm.MediaId);

            // ---------------------------------------------
            // ---------------------------------------------
            // StudioMedia
            // ---------------------------------------------
            // ---------------------------------------------

            modelBuilder.Entity<StudioMedia>()
                .HasKey(sm => new { sm.StudioId, sm.MediaId });

            modelBuilder.Entity<StudioMedia>()
                .HasOne(sm => sm.Studio)
                .WithMany(s => s.Media)
                .HasForeignKey(sm => sm.StudioId);

            modelBuilder.Entity<StudioMedia>()
                .HasOne(sm => sm.Media)
                .WithMany(m => m.StudioMedias)
                .HasForeignKey(sm => sm.MediaId);

            // ---------------------------------------------
            // ---------------------------------------------
            // Collection
            // ---------------------------------------------
            // ---------------------------------------------

            modelBuilder.Entity<Collection>()
                .HasOne(c => c.User)
                .WithMany(u => u.Collections)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Collection>()
                .HasIndex(c => new { c.UserId, c.Name })
                .IsUnique();

            // ---------------------------------------------
            // ---------------------------------------------
            // CollectionAnime
            // ---------------------------------------------
            // ---------------------------------------------

            modelBuilder.Entity<CollectionAnime>()
                .HasKey(ca => new { ca.CollectionId, ca.AnimeId });

            modelBuilder.Entity<CollectionAnime>()
                .HasOne(ca => ca.Collection)
                .WithMany(c => c.CollectionAnimes)
                .HasForeignKey(ca => ca.CollectionId);

            modelBuilder.Entity<CollectionAnime>()
                .HasOne(ca => ca.Anime)
                .WithMany(a => a.CollectionAnimes)
                .HasForeignKey(ca => ca.AnimeId);

            // =========================
            // UserAnimeStatus and WatchStatus
            // =========================

            modelBuilder.Entity<UserAnimeStatus>()
                .HasKey(uas => new { uas.UserId, uas.AnimeId }); // composite key без StatusId

            modelBuilder.Entity<UserAnimeStatus>()
                .HasOne(uas => uas.User)
                .WithMany(u => u.UserAnimeStatuses)
                .HasForeignKey(uas => uas.UserId);

            modelBuilder.Entity<UserAnimeStatus>()
                .HasOne(uas => uas.Anime)
                .WithMany(a => a.UserAnimeStatuses)
                .HasForeignKey(uas => uas.AnimeId);

            modelBuilder.Entity<UserAnimeStatus>()
                .HasOne(uas => uas.WatchStatus)
                .WithMany(ws => ws.UserAnimeStatuses)
                .HasForeignKey(uas => uas.StatusId)
                .OnDelete(DeleteBehavior.Restrict);

            // ---------------------------------------------
            // ---------------------------------------------
            // WatchStatus
            // ---------------------------------------------
            // ---------------------------------------------
            modelBuilder.Entity<WatchStatus>()
                .HasKey(ws => ws.Id);

            modelBuilder.Entity<WatchStatus>()
                .Property(ws => ws.StatusName)
                .HasConversion<string>()
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Anime>()
                .Property(a => a.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Anime>()
                .Property(a => a.Type)
                .HasConversion<string>();

            modelBuilder.Entity<Media>()
                .Property(m => m.Type)
                .HasConversion<string>();
                
            modelBuilder.Entity<AnimeCharacter>()
                .Property(ac => ac.Role)
                .HasConversion<string>();

            modelBuilder.Entity<AnimeAuthor>()
                .Property(aa => aa.Role)
                .HasConversion(new AuthorRoleConverter());

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Post>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            

            // ---------------------------------------------
            // ---------------------------------------------
            // PostMedia
            // ---------------------------------------------
            // ---------------------------------------------

            modelBuilder.Entity<PostMedia>()
                .HasKey(pm => new { pm.PostId, pm.MediaId });

            modelBuilder.Entity<PostMedia>()
                .HasOne(pm => pm.Post)
                .WithMany(p => p.Media)
                .HasForeignKey(pm => pm.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PostMedia>()
                .HasOne(pm => pm.Media)
                .WithMany(m => m.PostMedias)
                .HasForeignKey(pm => pm.MediaId)
                .OnDelete(DeleteBehavior.Restrict);

            // ---------------------------------------------
            // ---------------------------------------------
            // ClubMedia
            // ---------------------------------------------
            // ---------------------------------------------

            modelBuilder.Entity<ClubMedia>()
                .HasKey(cm => new { cm.ClubId, cm.MediaId });

            modelBuilder.Entity<ClubMedia>()
                .HasOne(cm => cm.Club)
                .WithMany(c => c.Media)
                .HasForeignKey(cm => cm.ClubId);

            modelBuilder.Entity<ClubMedia>()
                .HasOne(cm => cm.Media)
                .WithMany(m => m.ClubMedias)
                .HasForeignKey(cm => cm.MediaId);

            // ---------------------------------------------
            // ---------------------------------------------
            // ClubPostMedia
            // ---------------------------------------------
            // ---------------------------------------------

            modelBuilder.Entity<ClubPostMedia>()
                .HasKey(cpm => new { cpm.ClubPostId, cpm.MediaId });

            modelBuilder.Entity<ClubPostMedia>()
                .HasOne(cpm => cpm.ClubPost)
                .WithMany(cp => cp.Media)
                .HasForeignKey(cpm => cpm.ClubPostId);

            modelBuilder.Entity<ClubPostMedia>()
                .HasOne(cpm => cpm.Media)
                .WithMany(m => m.ClubPostMedias)
                .HasForeignKey(cpm => cpm.MediaId);

            // ---------------------------------------------
            // ---------------------------------------------
            // UserClub
            // ---------------------------------------------
            // ---------------------------------------------

            modelBuilder.Entity<UserClub>()
                .HasKey(uc => new { uc.UserId, uc.ClubId });

            modelBuilder.Entity<UserClub>()
                .HasOne(uc => uc.User)
                .WithMany(u => u.UserClubs)
                .HasForeignKey(uc => uc.UserId);

            modelBuilder.Entity<UserClub>()
                .HasOne(uc => uc.Club)
                .WithMany(c => c.Members)
                .HasForeignKey(uc => uc.ClubId);

            modelBuilder.Entity<PostReaction>()
                .HasIndex(r => new { r.PostId, r.UserId })
                .IsUnique();

            modelBuilder.Entity<CommentReaction>()
                .HasIndex(r => new { r.CommentId, r.UserId })
                .IsUnique();

            modelBuilder.Entity<ClubPostReaction>()
                .HasIndex(r => new { r.PostId, r.UserId })
                .IsUnique();

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.ParentComment)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentCommentId)
                .OnDelete(DeleteBehavior.Cascade);

            // ---------------------------------------------
            // ---------------------------------------------
            // User
            // ---------------------------------------------
            // ---------------------------------------------

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();


            // ---------------------------------------------
            // ---------------------------------------------
            // Friendship
            // ---------------------------------------------
            // ---------------------------------------------
            modelBuilder.Entity<Friendship>()
                .HasOne(f => f.Requester)
                .WithMany(u => u.SentFriendRequests)
                .HasForeignKey(f => f.RequesterId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Friendship>()
                .HasOne(f => f.Addressee)
                .WithMany(u => u.ReceivedFriendRequests)
                .HasForeignKey(f => f.AddresseeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Friendship>()
                .HasIndex(f => new { f.RequesterId, f.AddresseeId })
                .IsUnique();
            
            modelBuilder.Entity<Friendship>()
                .ToTable(t =>
                {
                    t.HasCheckConstraint(
                        "CK_Friendship_NoSelfFriend",
                        "RequesterId <> AddresseeId"
                    );
                });
            
            // ---------------------------------------------
            // ---------------------------------------------
            // Notification
            // ---------------------------------------------
            // ---------------------------------------------
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Sender)
                .WithMany()
                .HasForeignKey(n => n.SenderId)
                .OnDelete(DeleteBehavior.SetNull);

            // ---------------------------------------------
            // ---------------------------------------------
            // HomeAnnouncement
            // ---------------------------------------------
            // ---------------------------------------------
            modelBuilder.Entity<HomeAnnouncement>()
                .HasOne(a => a.Media)
                .WithMany()
                .HasForeignKey(a => a.MediaId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
