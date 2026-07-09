using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Auth;
using Corevia.First.Application.Configuration;
using Corevia.First.Domain.Entities;
using Corevia.First.Domain.Enums;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Corevia.First.Application.Services;

public sealed class JwtTokenGenerator : IJwtTokenGenerator
{
    private readonly JwtOptions _options;

    public JwtTokenGenerator(IOptions<JwtOptions> options) => _options = options.Value;

    public (string AccessToken, DateTimeOffset AccessExpiresAtUtc, string Jti) CreateAccessToken(User user)
    {
        var jti = Guid.NewGuid().ToString("N");
        var expiresAt = DateTimeOffset.UtcNow.AddMinutes(_options.AccessTokenMinutes);
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Key));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var roleName = user.Role == UserRole.Admin ? "admin" : "client";

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Jti, jti),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new("role", roleName),
        };

        if (user.IsSuperAdmin)
            claims.Add(new Claim(AuthClaims.IsSuperAdmin, "true"));

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            expires: expiresAt.UtcDateTime,
            signingCredentials: credentials);

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        
        return (jwt, expiresAt, jti);
    }
}
