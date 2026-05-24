using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using AniRiseBackend.Models;

namespace AniRiseBackend.Converters;

public class AuthorRoleConverter : ValueConverter<AuthorRole, string>
{
    public AuthorRoleConverter() 
        : base(
            v => v.ToString(),  // Enum → string
            v => ParseAuthorRole(v) // string → Enum
        )
    { }

    private static AuthorRole ParseAuthorRole(string role)
    {
        if (string.IsNullOrWhiteSpace(role))
            return AuthorRole.Supporting;

        var normalized = role.Trim()
            .Replace(" ", "")
            .Replace("2nd", "Second")
            .Replace("ADR", "Adr");

        return Enum.TryParse<AuthorRole>(normalized, true, out var parsed)
            ? parsed
            : AuthorRole.Supporting;
    }
}
