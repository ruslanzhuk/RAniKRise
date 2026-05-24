using AniRiseBackend.Data;
using AniRiseBackend.Models;
using AniRiseBackend.Dtos.Admin;
using AniRiseBackend.Helpers;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace AniRiseBackend.Services;

public class AdminAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _configuration;

    public AdminAuthService(AppDbContext db, IConfiguration configuration)
    {
        _db = db;
        _configuration = configuration;
    }

    public async Task<string> LoginAsync(string email, string password)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
            throw new UnauthorizedAccessException("Invalid credentials");

        if (!user.IsEmailConfirmed)
            throw new UnauthorizedAccessException("Email is not confirmed");

        if (!BCrypt.Net.BCrypt.Verify(password, user.Password))
            throw new UnauthorizedAccessException("Invalid credentials");

        return GenerateJwtToken(user);
    }

    private string GenerateJwtToken(User user)
    {
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public async Task<AdminProfileDTO?> GetAdminProfileAsync(Guid adminId)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == adminId && u.Role == UserRole.Admin);
        if (user == null) return null;

        return new AdminProfileDTO
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            BirthDate = user.BirthDate,
            Gender = user.Gender,
            Visibility = user.Visibility,
            ThemePreference = user.ThemePreference
        };
    }
}
