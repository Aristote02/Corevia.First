using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;
using Corevia.First.Application.Abstractions.Repositories;
using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using Corevia.First.Application.Mapping;
using Corevia.First.Domain.Entities;
using Corevia.First.Domain.Enums;
using Corevia.First.Domain.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace Corevia.First.Infrastructure.Auth;

public sealed class SupabaseAuthService : ISupabaseAuthService
{
    private readonly SupabaseOptions _options;
    private readonly IUserRepository _users;
    private readonly ILogger<SupabaseAuthService> _logger;
    private readonly ConfigurationManager<OpenIdConnectConfiguration>? _configurationManager;

    public SupabaseAuthService(IOptions<SupabaseOptions> options, IUserRepository users, ILogger<SupabaseAuthService> logger)
    {
        _options = options.Value;
        _users = users;
        _logger = logger;

        if (!_options.Enabled)
            return;

        var authority = BuildAuthority(_options.ProjectUrl);
        _configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(
            $"{authority}/.well-known/openid-configuration",
            new OpenIdConnectConfigurationRetriever());
    }

    public async Task<UserProfileDto?> SyncSessionAsync(string accessToken, CancellationToken cancellationToken = default)
    {
        if (!_options.Enabled)
            return null;

        var principal = await ValidateAccessTokenAsync(accessToken, cancellationToken);
        return principal is null ? null : await UpsertFromPrincipalAsync(principal, cancellationToken);
    }

    public async Task<UserProfileDto?> ResolveLocalUserAsync(ClaimsPrincipal principal, CancellationToken cancellationToken = default)
    {
        if (!_options.Enabled)
            return null;

        return await UpsertFromPrincipalAsync(principal, cancellationToken);
    }

    private async Task<ClaimsPrincipal?> ValidateAccessTokenAsync(string accessToken, CancellationToken cancellationToken)
    {
        if (_configurationManager is null)
            return null;

        try
        {
            var authority = BuildAuthority(_options.ProjectUrl);
            var oidc = await _configurationManager.GetConfigurationAsync(cancellationToken);
            var parameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = authority,
                ValidateAudience = true,
                ValidAudience = _options.JwtAudience,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKeys = oidc.SigningKeys,
                ClockSkew = TimeSpan.FromMinutes(1),
            };

            var handler = new JwtSecurityTokenHandler();
            return handler.ValidateToken(accessToken, parameters, out _);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Supabase access token validation failed.");
            return null;
        }
    }

    private async Task<UserProfileDto?> UpsertFromPrincipalAsync(ClaimsPrincipal principal, CancellationToken cancellationToken)
    {
        var sub = principal.FindFirstValue("sub") ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(sub) || !Guid.TryParse(sub, out var supabaseId))
            return null;

        var email = ExtractEmail(principal);
        if (string.IsNullOrEmpty(email))
            return null;

        var fullName = ExtractFullName(principal, email);
        var now = DateTimeOffset.UtcNow;

        var user = await _users.GetBySupabaseAuthIdTrackedAsync(supabaseId, cancellationToken)
            ?? await _users.GetByEmailTrackedAsync(email, cancellationToken);

        if (user is null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                Email = email,
                FullName = fullName,
                Role = UserRole.Client,
                SupabaseAuthId = supabaseId,
                PasswordHash = string.Empty,
                CreatedAt = now,
                UpdatedAt = now,
            };
            await _users.AddAsync(user, cancellationToken);
        }
        else
        {
            user.SupabaseAuthId ??= supabaseId;
            user.Email = email;
            if (!string.IsNullOrWhiteSpace(fullName))
                user.FullName = fullName;
            user.UpdatedAt = now;
        }

        await _users.SaveChangesAsync(cancellationToken);
        return user.ToProfileDto();
    }

    private static string? ExtractEmail(ClaimsPrincipal principal)
    {
        var email = principal.FindFirstValue("email");
        if (!string.IsNullOrWhiteSpace(email))
            return email.Trim().ToLowerInvariant();

        if (principal.Identity is ClaimsIdentity identity &&
            identity.BootstrapContext is JwtSecurityToken jwt)
        {
            if (jwt.Payload.TryGetValue("user_metadata", out var metadataObj))
            {
                try
                {
                    var json = metadataObj is JsonElement element ? element : JsonSerializer.SerializeToElement(metadataObj);
                    if (json.TryGetProperty("email", out var emailProp))
                    {
                        var fromMeta = emailProp.GetString();
                        if (!string.IsNullOrWhiteSpace(fromMeta))
                            return fromMeta.Trim().ToLowerInvariant();
                    }
                }
                catch
                {
                    // ignore malformed metadata
                }
            }
        }

        return null;
    }

    private static string ExtractFullName(ClaimsPrincipal principal, string email)
    {
        var name = principal.FindFirstValue("full_name")
            ?? principal.FindFirstValue(ClaimTypes.Name);
        if (!string.IsNullOrWhiteSpace(name))
            return name.Trim();

        if (principal.Identity is ClaimsIdentity identity &&
            identity.BootstrapContext is JwtSecurityToken jwt &&
            jwt.Payload.TryGetValue("user_metadata", out var metadataObj))
        {
            try
            {
                var json = metadataObj is JsonElement element ? element : JsonSerializer.SerializeToElement(metadataObj);
                if (json.TryGetProperty("full_name", out var fullNameProp))
                {
                    var fromMeta = fullNameProp.GetString();
                    if (!string.IsNullOrWhiteSpace(fromMeta))
                        return fromMeta.Trim();
                }
            }
            catch
            {
                // ignore malformed metadata
            }
        }

        var local = email.Split('@')[0];
        return string.IsNullOrWhiteSpace(local) ? "User" : local;
    }

    private static string BuildAuthority(string projectUrl) =>
        $"{projectUrl.TrimEnd('/')}/auth/v1";
}
