using AniRiseBackend.Data;
using AniRiseBackend.Models;
using AniRiseBackend.Dtos;
using Microsoft.EntityFrameworkCore;

namespace AniRiseBackend.Services;

public interface IPostService
{
    Task<PostResponseDTO> CreateAsync(Guid userId, PostCreateDTO request);
    Task<List<PostResponseDTO>> GetUserPostsAsync(Guid userId, Guid? viewerId);
    Task<PostResponseDTO?> UpdateAsync(Guid userId, long postId, PostUpdateDTO dto);
    Task DeleteAsync(Guid userId, bool isAdmin, long postId);
}

public class PostService : IPostService
{
    private readonly AppDbContext _db;
    private readonly CloudinaryService _cloudinary;

    public PostService(AppDbContext db, CloudinaryService cloudinary)
    {
        _db = db;
        _cloudinary = cloudinary;
    }

    // ------------------------
    // CREATE
    // ------------------------
    public async Task<PostResponseDTO> CreateAsync(Guid userId, PostCreateDTO request)
    {
        if (string.IsNullOrWhiteSpace(request.Content))
            throw new ArgumentException("Post content cannot be empty");

        var user = await _db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("User not found");

        var post = new Post
        {
            UserId = userId,
            Content = request.Content.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _db.Posts.Add(post);
        await _db.SaveChangesAsync();

        if (request.MediaFiles is { Count: > 0 })
        {
            foreach (var file in request.MediaFiles)
            {
                var url = await _cloudinary.UploadPostMediaAsync(
                    file,
                    $"posts/{userId}/{post.Id}"
                );

                var media = new Media
                {
                    Url = url,
                    Type = ResolveMediaType(file)
                };

                _db.Medias.Add(media);
                await _db.SaveChangesAsync();

                _db.PostMedias.Add(new PostMedia
                {
                    PostId = post.Id,
                    MediaId = media.Id
                });
            }

            await _db.SaveChangesAsync();
        }

        await _db.Entry(post).Reference(p => p.User).LoadAsync();
        await _db.Entry(post)
            .Collection(p => p.Media)
            .Query()
            .Include(pm => pm.Media)
            .LoadAsync();

        return Map(post, user);
    }

    // ------------------------
    // GET USER POSTS
    // ------------------------
    public async Task<List<PostResponseDTO>> GetUserPostsAsync(Guid userId, Guid? viewerId)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("User not found");

        var isOwner = viewerId == userId;

        if (user.Visibility == AccountVisibility.Private && !isOwner)
        {
            if (viewerId == null)
                throw new UnauthorizedAccessException("Private profile");

            var isFriend = await _db.Friendships.AnyAsync(f =>
                f.Status == FriendStatus.Accepted &&
                (
                    (f.RequesterId == userId && f.AddresseeId == viewerId) ||
                    (f.RequesterId == viewerId && f.AddresseeId == userId)
                )
            );

            if (!isFriend)
                return new List<PostResponseDTO>();
        }

        var posts = await _db.Posts
            .Where(p => p.UserId == userId)
            .Include(p => p.User)
            .Include(p => p.Media)
                .ThenInclude(pm => pm.Media)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return posts.Select(p => Map(p, p.User)).ToList();
    }

    // ------------------------
    // UPDATE
    // ------------------------
    public async Task<PostResponseDTO?> UpdateAsync(Guid userId, long postId, PostUpdateDTO dto)
    {
        var post = await _db.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == postId);

        if (post == null)
            return null;

        if (post.UserId != userId)
            throw new UnauthorizedAccessException();

        if (!string.IsNullOrWhiteSpace(dto.Content))
            post.Content = dto.Content.Trim();

        post.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Map(post, post.User);
    }

    // ------------------------
    // DELETE
    // ------------------------
    public async Task DeleteAsync(Guid userId, bool isAdmin, long postId)
    {
        var post = await _db.Posts.FindAsync(postId)
            ?? throw new KeyNotFoundException("Post not found");

        if (post.UserId != userId && !isAdmin)
            throw new UnauthorizedAccessException();

        _db.Posts.Remove(post);
        await _db.SaveChangesAsync();
    }

    // ------------------------
    // HELPERS
    // ------------------------
    private static MediaType ResolveMediaType(IFormFile file)
    {
        if (file.ContentType.StartsWith("image/"))
            return MediaType.Anime_screen;

        if (file.ContentType.StartsWith("video/"))
            return MediaType.Anime_thriller;

        return MediaType.Anime_screen;
    }

    private static PostResponseDTO Map(Post post, User user)
    {
        return new PostResponseDTO
        {
            Id = post.Id,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            UpdatedAt = post.UpdatedAt,
            MediaUrls = post.Media
                .Select(pm => pm.Media.Url)
                .ToList(),
            Author = new PostAuthorDTO
            {
                Id = user.Id,
                Username = user.Username,
                AvatarUrl = user.AvatarUrl
            }
        };
    }
}
