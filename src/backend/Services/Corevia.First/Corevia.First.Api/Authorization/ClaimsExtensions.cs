using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Corevia.First.Application.Auth;
using Corevia.First.Domain.Constants;

namespace Corevia.First.Api.Authorization;

public static class ClaimsExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var localUserId = user.FindFirstValue(AuthSchemeNames.LocalUserIdClaim);
        if (!string.IsNullOrEmpty(localUserId) && Guid.TryParse(localUserId, out var mappedId))
            return mappedId;

        var id = user.FindFirstValue(JwtRegisteredClaimNames.Sub)
                 ?? user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (id is null || !Guid.TryParse(id, out var userId))
            throw new InvalidOperationException("Missing or invalid user id claim.");
        return userId;
    }

    public static bool IsSuperAdmin(this ClaimsPrincipal user) =>
        user.HasClaim(AuthClaims.IsSuperAdmin, "true");

    public static string? GetAccessTokenJti(this ClaimsPrincipal user) =>
        user.FindFirstValue(JwtRegisteredClaimNames.Jti);

    public static DateTimeOffset? GetAccessTokenExpiresUtc(this ClaimsPrincipal user)
    {
        var exp = user.FindFirstValue(JwtRegisteredClaimNames.Exp);
        if (exp is null || !long.TryParse(exp, out var seconds))
            return null;
        return DateTimeOffset.FromUnixTimeSeconds(seconds);
    }
}
