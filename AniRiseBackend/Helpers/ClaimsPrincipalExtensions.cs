using System;
using System.Security.Claims;

namespace AniRiseBackend.Helpers;

public static class ClaimsPrincipalExtensions
{
    /// Returns the GUID of the currently logged-in user.
    /// Throws an UnauthorizedAccessException if the user is not logged in.
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        if (user == null)
            throw new UnauthorizedAccessException("User is null");

        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            throw new UnauthorizedAccessException("User not authenticated");

        return userId;
    }

    /// Returns the role of the currently logged-in user. Returns an empty string if the claim is not found.
    public static string GetUserRole(this ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
    }

    /// Checks if the user is logged in.
    public static bool IsLoggedIn(this ClaimsPrincipal user)
    {
        try
        {
            var _ = user.GetUserId();
            return true;
        }
        catch
        {
            return false;
        }
    }

    /// Checks if the logged-in user has the Admin role.
    /// Throws an UnauthorizedAccessException if the user is not logged in.
    public static bool IsAdmin(this ClaimsPrincipal user)
    {
        if (!user.IsLoggedIn())
            throw new UnauthorizedAccessException("User not authenticated");

        return string.Equals(user.GetUserRole(), "Admin", StringComparison.OrdinalIgnoreCase);
    }
}