using AniRiseBackend.Data;
using AniRiseBackend.Models;
using AniRiseBackend.Dtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AniRiseBackend.Contracts;
using MailKit.Net.Smtp;
using MimeKit;
using AniRiseBackend.Services;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;


namespace AniRiseBackend.Services;

public class UserService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;

    private readonly CloudinaryService _cloudinaryService;

    public UserService(AppDbContext context, IConfiguration configuration, IEmailService emailService, CloudinaryService cloudinaryService)
    {
        _db = context;
        _configuration = configuration;
        _emailService = emailService;
        _cloudinaryService = cloudinaryService;
    }

    private static UserProfileDTO MapToProfileDto(User user)
    {
        return new UserProfileDTO
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl,
            IsBlocked = user.IsBlocked,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            BirthDate = user.BirthDate,
            Gender = user.Gender,
            Visibility = user.Visibility,
            ThemePreference = user.ThemePreference
        };
    }

    public async Task<List<UserProfileDTO>> GetUsersAsync(
        string? query = null,
        int page = 1,
        int pageSize = 20,
        bool sortByCollection = false,
        CancellationToken ct = default)
    {
        var usersQuery = _db.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query))
            usersQuery = usersQuery.Where(u => EF.Functions.Like(u.Username, $"%{query}%"));

        if (sortByCollection)
        {
            usersQuery = usersQuery
                .OrderByDescending(u => u.Collections.Count);
        }
        else
        {
            usersQuery = usersQuery
                .OrderBy(u => u.Role)
                .ThenBy(u => u.Username);
        }

        var users = await usersQuery
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new UserProfileDTO
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                AvatarUrl = u.AvatarUrl,
                IsBlocked = u.IsBlocked,
                BirthDate = u.BirthDate,
                Gender = u.Gender,
                Role = u.Role,
                CreatedAt = u.CreatedAt,
                JoinedOn = u.JoinedOn,
                Visibility = u.Visibility,
                ThemePreference = u.ThemePreference
            })
            .ToListAsync(ct);

        return users;
    }


    public async Task<User> RegisterAsync(string username, string email, string password)
    {
        if (await _db.Users.AnyAsync(u => u.Email == email))
            throw new Exception("Email already in use");

        if (await _db.Users.AnyAsync(u => u.Username == username))
            throw new Exception("Username already in use");

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
        var token = Guid.NewGuid().ToString();

        var user = new User
        {
            Username = username,
            Email = email,
            Password = hashedPassword,
            Role = UserRole.User,
            IsEmailConfirmed = false,
            EmailConfirmationToken = token,
            EmailConfirmationTokenExpires = DateTime.UtcNow.AddHours(24)
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        await _emailService.SendEmailConfirmationAsync(user);

        return user;
    }

    public async Task<string> LoginAsync(string email, string password)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
            throw new Exception("Invalid credentials");

        if (!user.IsEmailConfirmed)
            throw new Exception("Email is not confirmed");

        if (!BCrypt.Net.BCrypt.Verify(password, user.Password))
            throw new Exception("Invalid credentials");

        return GenerateJwtToken(user);
    }

    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }   

    public async Task ConfirmEmailAsync(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
            throw new ArgumentException("Token must be provided.");

        token = token.Trim();

        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.EmailConfirmationToken == token);

        if (user == null)
            throw new Exception("Invalid token.");

        if (user.IsEmailConfirmed)
            throw new Exception("Email is already confirmed.");

        if (user.EmailConfirmationTokenExpires < DateTime.UtcNow)
            throw new Exception("Token has expired.");

        user.IsEmailConfirmed = true;
        user.EmailConfirmationToken = null;
        user.EmailConfirmationTokenExpires = null;

        _db.Users.Update(user);
        await _db.SaveChangesAsync();
    }


    public async Task<UserProfileDTO?> GetUserByIdAsync(Guid userId)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return null;

        return new UserProfileDTO
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl,
            IsBlocked = user.IsBlocked,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            BirthDate = user.BirthDate, 
            Gender = user.Gender, 
            Visibility = user.Visibility,
            ThemePreference = user.ThemePreference  
        };
    }

    public async Task<UserProfileDTO?> GetPublicProfileByUsernameAsync(string username)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null) return null;

        return new UserProfileDTO
        {
            Id = user.Id,
            Username = user.Username,
            AvatarUrl = user.AvatarUrl,
            IsBlocked = user.IsBlocked,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            Visibility = user.Visibility,
            BirthDate = user.BirthDate,
            Gender = user.Gender
        };
    }

    public async Task<bool> IsUsernameTakenAsync(string username)
    {
        return await _db.Users.AnyAsync(u => u.Username == username);
    }

    public async Task<UserProfileDTO> UpdateUserAsync(Guid userId, UpdateUserRequest request)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null)
            throw new Exception("User not found.");

        bool emailChanged = false;

        if (!string.IsNullOrWhiteSpace(request.Username) && request.Username != user.Username)
        {
            if (await _db.Users.AnyAsync(u => u.Username == request.Username && u.Id != userId))
                throw new Exception("Username already in use.");
            user.Username = request.Username;
        }

        if (!string.IsNullOrWhiteSpace(request.Email) && request.Email != user.Email)
        {
            if (!IsValidEmail(request.Email))
                throw new Exception("Invalid email address.");

            if (await _db.Users.AnyAsync(u => u.Email == request.Email && u.Id != userId))
                throw new Exception("Email already in use.");

            user.Email = request.Email;
            user.IsEmailConfirmed = false;
            user.EmailConfirmationToken = Guid.NewGuid().ToString("N");
            user.EmailConfirmationTokenExpires = DateTime.UtcNow.AddHours(24);

            emailChanged = true;
        }

        if (!string.IsNullOrWhiteSpace(request.Password))
            user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);

        if (!string.IsNullOrWhiteSpace(request.AvatarUrl))
            user.AvatarUrl = request.AvatarUrl;

        if (request.BirthDate.HasValue)
            user.BirthDate = request.BirthDate;

        if (request.Gender.HasValue)
            user.Gender = request.Gender;

        if (request.Visibility.HasValue)
            user.Visibility = request.Visibility.Value;
        
        if (!string.IsNullOrWhiteSpace(request.ThemePreference))
            user.ThemePreference = request.ThemePreference;

        _db.Users.Update(user);
        await _db.SaveChangesAsync();

        if (emailChanged)
        {
            await _emailService.SendEmailConfirmationAsync(user);
        }

        return new UserProfileDTO
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl,
            IsBlocked = user.IsBlocked,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            BirthDate = user.BirthDate,
            Gender = user.Gender,
            Visibility = user.Visibility,
            ThemePreference = user.ThemePreference
        };
    }

    private bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    public async Task<User> UpdateAvatarAsync(Guid userId, UpdateAvatarRequest request)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null) throw new Exception("User not found.");

        var avatarUrl = await _cloudinaryService.UploadAvatarAsync(
            request.AvatarUrl,
            user.Id.ToString(),
            request.CropX,
            request.CropY,
            request.CropWidth,
            request.CropHeight
        );

        user.AvatarUrl = avatarUrl;
        _db.Users.Update(user);
        await _db.SaveChangesAsync();

        return user;
    }

    public async Task<UserStatsDTO> GetUserStatsAsync(Guid userId)
    {
        var totalWathing = await _db.UserAnimeStatuses.CountAsync(s => s.UserId == userId && s.WatchStatus.StatusName == WatchStatusEnum.Watching);
        var totalCompleted = await _db.UserAnimeStatuses.CountAsync(s => s.UserId == userId && s.WatchStatus.StatusName == WatchStatusEnum.Completed);
        var totalPlanned = await _db.UserAnimeStatuses.CountAsync(s => s.UserId == userId && s.WatchStatus.StatusName == WatchStatusEnum.PlanToWatch);
        var totalDropped = await _db.UserAnimeStatuses.CountAsync(s => s.UserId == userId && s.WatchStatus.StatusName == WatchStatusEnum.Dropped);
        var totalOnHold = await _db.UserAnimeStatuses.CountAsync(s => s.UserId == userId && s.WatchStatus.StatusName == WatchStatusEnum.OnHold);

        return new UserStatsDTO
        {
            TotalWatching = totalWathing,
            TotalCompleted = totalCompleted,
            TotalPlanned = totalPlanned,
            TotalDropped = totalDropped,
            TotalOnHold = totalOnHold,
        };
    }

    public async Task<UserProfileDTO?> GetPublicProfileAsync(Guid userId)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return null;

        return new UserProfileDTO
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl,
            IsBlocked = user.IsBlocked,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            BirthDate = user.BirthDate,
            Gender = user.Gender,
            Visibility = user.Visibility,
            ThemePreference = user.ThemePreference
        };
    }

    public async Task<UserProfileDTO> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null) throw new Exception("User not found");

        if (user.Username != request.Username)
        {
            if (await _db.Users.AnyAsync(u => u.Username == request.Username && u.Id != userId))
                throw new Exception("Username already taken");

            user.Username = request.Username;
        }

        user.BirthDate = request.BirthDate;
        user.Gender = request.Gender;
        user.Visibility = request.Visibility;

        await _db.SaveChangesAsync();

        return MapToProfileDto(user);
    }

    public async Task<EmailChangeStatusDto> GetEmailChangeStatusAsync(Guid userId)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new Exception("User not found");

        if (user.PendingEmail == null)
        {
            return new EmailChangeStatusDto
            {
                InProgress = false,
                Step = "none"
            };
        }

        if (user.OldEmailToken != null)
        {
            return new EmailChangeStatusDto
            {
                InProgress = true,
                Step = "confirm-old",
                PendingEmail = user.PendingEmail
            };
        }

        if (user.NewEmailToken != null)
        {
            return new EmailChangeStatusDto
            {
                InProgress = true,
                Step = "confirm-new",
                PendingEmail = user.PendingEmail
            };
        }

        return new EmailChangeStatusDto
        {
            InProgress = false,
            Step = "none"
        };
    }

    public async Task RequestEmailChangeAsync(Guid userId, string newEmail)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new Exception("User not found");

        if (string.IsNullOrWhiteSpace(newEmail))
            throw new Exception("New email is required");

        if (user.PendingEmail != null)
        {
            return;
        }

        if (user.Email == newEmail)
            throw new Exception("New email must be different from current email");

        if (await _db.Users.AnyAsync(u => u.Email == newEmail))
            throw new Exception("Email already in use");

        user.PendingEmail = newEmail;
        user.OldEmailToken = GenerateCode();
        user.NewEmailToken = null;
        user.EmailChangeTokenExpires = DateTime.UtcNow.AddMinutes(15);

        await _db.SaveChangesAsync();

        await _emailService.SendEmailAsync(
            user.Email,
            "Confirm your current email",
            $"Your confirmation code: {user.OldEmailToken}"
        );
    }


    public async Task CancelEmailChangeAsync(Guid userId)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null)
            throw new Exception("User not found");

        user.PendingEmail = null;
        user.OldEmailToken = null;
        user.NewEmailToken = null;
        user.EmailChangeTokenExpires = null;

        await _db.SaveChangesAsync();
    }

    public async Task ConfirmEmailChangeAsync(Guid userId, string token)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null)
            throw new Exception("User not found");

        if (!user.EmailChangeTokenExpires.HasValue || user.EmailChangeTokenExpires < DateTime.UtcNow)
            throw new Exception("Token expired");

        if (user.OldEmailToken == token)
        {
            user.OldEmailToken = null;
            user.NewEmailToken = GenerateCode();
            user.EmailChangeTokenExpires = DateTime.UtcNow.AddMinutes(15);

            await _db.SaveChangesAsync();

            await _emailService.SendEmailAsync(
                user.PendingEmail!,
                "Confirm your new email",
                $"Your confirmation code: {user.NewEmailToken}"
            );

            return;
        }

        if (user.NewEmailToken == token)
        {
            user.Email = user.PendingEmail!;
            user.PendingEmail = null;
            user.NewEmailToken = null;
            user.EmailChangeTokenExpires = null;
            user.IsEmailConfirmed = true;

            await _db.SaveChangesAsync();
            return;
        }

        throw new Exception("Invalid confirmation code");
    }


    private string GenerateCode()
    {
        return Random.Shared.Next(100000, 999999).ToString();
    }

    public async Task RequestPasswordResetAsync(string email)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
            return;

        user.PasswordResetToken = Guid.NewGuid().ToString("N");
        user.PasswordResetTokenExpires = DateTime.UtcNow.AddMinutes(15);

        await _db.SaveChangesAsync();

        var link =
            $"{_configuration["Frontend:Url"]}/reset-password?token={user.PasswordResetToken}";

        await _emailService.SendEmailAsync(
            user.Email,
            "Reset your password",
            $"Click here to reset password: <a href='{link}'>Reset</a>"
        );
    }

    public async Task ConfirmPasswordResetAsync(string token, string newPassword)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.PasswordResetToken == token);

        if (user == null)
            throw new Exception("Invalid token");

        if (user.PasswordResetTokenExpires < DateTime.UtcNow)
            throw new Exception("Token expired");

        if (newPassword.Length < 8)
            throw new Exception("Password must be at least 8 characters");

        user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpires = null;

        await _db.SaveChangesAsync();
    }


    public async Task UpdateThemeAsync(Guid userId, string themePreference)
    {
        if (themePreference != "light" && themePreference != "dark")
            throw new ArgumentException("Invalid theme preference");

        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new KeyNotFoundException("User not found");

        user.ThemePreference = themePreference;

        await _db.SaveChangesAsync();
    }

    public async Task DeleteAccountAsync(Guid userId, string password)
    {
        await using var transaction = await _db.Database.BeginTransactionAsync();

        try
        {
            var user = await _db.Users
                .Include(u => u.Comments)
                .Include(u => u.Posts)
                .Include(u => u.UserAnimeStatuses)
                .Include(u => u.Collections)
                .Include(u => u.Ratings)
                .Include(u => u.UserClubs)
                .Include(u => u.SentFriendRequests)
                .Include(u => u.ReceivedFriendRequests)
                .Include(u => u.Notifications)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                throw new KeyNotFoundException("User not found");

            if (!BCrypt.Net.BCrypt.Verify(password, user.Password))
                throw new UnauthorizedAccessException("Incorrect password");

            _db.Friendships.RemoveRange(user.SentFriendRequests);
            _db.Friendships.RemoveRange(user.ReceivedFriendRequests);
            _db.UserClubs.RemoveRange(user.UserClubs);
            _db.Collections.RemoveRange(user.Collections);
            _db.Ratings.RemoveRange(user.Ratings);
            _db.UserAnimeStatuses.RemoveRange(user.UserAnimeStatuses);
            _db.Notifications.RemoveRange(user.Notifications);

            _db.Users.Remove(user);

            await _db.SaveChangesAsync();

            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

}
