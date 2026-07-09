using Corevia.First.Application.Abstractions.Repositories;
using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Configuration;
using Corevia.First.Application.Dtos;
using Corevia.First.Application.Mapping;
using Corevia.First.Application.Security;
using Corevia.First.Domain.Entities;
using Corevia.First.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Corevia.First.Application.Services;

public sealed class AuthService : IAuthService
{
    private readonly IUserRepository _users;
    private readonly IRefreshTokenRepository _refreshTokens;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IJwtTokenGenerator _jwt;
    private readonly ITokenBlacklistService _blacklist;
    private readonly JwtOptions _jwtOptions;
    private readonly ILogger<AuthService> _logger;
    private readonly IHostEnvironment _env;
    private readonly IServiceScopeFactory _scopeFactory;

    public AuthService(
        IUserRepository users,
        IRefreshTokenRepository refreshTokens,
        IPasswordHasher<User> passwordHasher,
        IJwtTokenGenerator jwt,
        ITokenBlacklistService blacklist,
        IOptions<JwtOptions> jwtOptions,
        ILogger<AuthService> logger,
        IHostEnvironment env,
        IServiceScopeFactory scopeFactory)
    {
        _users = users;
        _refreshTokens = refreshTokens;
        _passwordHasher = passwordHasher;
        _jwt = jwt;
        _blacklist = blacklist;
        _jwtOptions = jwtOptions.Value;
        _logger = logger;
        _env = env;
        _scopeFactory = scopeFactory;
    }

    public async Task<AuthResponse?> SignUpAsync(SignUpRequest request, CancellationToken cancellationToken = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        if (await _users.ExistsByEmailAsync(email, cancellationToken))
            return null;

        var now = DateTimeOffset.UtcNow;
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            Role = UserRole.Client,
            FullName = request.FullName.Trim(),
            CreatedAt = now,
            UpdatedAt = now,
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);
        await _users.AddAsync(user, cancellationToken);
        await _users.SaveChangesAsync(cancellationToken);

        QueueWelcomeEmail(user.Email, user.FullName);

        return await IssueTokensAsync(user, cancellationToken);
    }

    public async Task<AuthResponse?> SignInAsync(SignInRequest request, CancellationToken cancellationToken = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _users.GetByEmailTrackedAsync(email, cancellationToken);
        if (user is null || string.IsNullOrEmpty(user.PasswordHash))
            return null;

        var verification = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (verification == PasswordVerificationResult.Failed)
            return null;

        return await IssueTokensAsync(user, cancellationToken);
    }

    public async Task<AuthResponse?> RefreshAsync(RefreshTokenRequest request, CancellationToken cancellationToken = default)
    {
        var hash = TokenCrypto.Hash(request.RefreshToken);
        var existing = await _refreshTokens.FindActiveByTokenHashWithUserAsync(hash, cancellationToken);
        if (existing is null)
            return null;

        existing.RevokedAtUtc = DateTimeOffset.UtcNow;
        await _refreshTokens.SaveChangesAsync(cancellationToken);

        return await IssueTokensAsync(existing.User, cancellationToken);
    }

    public async Task SignOutAsync(Guid userId, string accessTokenJti, DateTimeOffset accessExpiresAtUtc, CancellationToken cancellationToken = default)
    {
        await _blacklist.BlacklistAccessTokenAsync(accessTokenJti, accessExpiresAtUtc, cancellationToken);

        var tokens = await _refreshTokens.ListActiveByUserIdAsync(userId, cancellationToken);
        foreach (var t in tokens)
            t.RevokedAtUtc = DateTimeOffset.UtcNow;

        await _refreshTokens.SaveChangesAsync(cancellationToken);
    }

    public async Task ForgotPasswordAsync(ForgotPasswordRequest request, CancellationToken cancellationToken = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _users.GetByEmailTrackedAsync(email, cancellationToken);
        if (user is null)
            return;

        var plain = TokenCrypto.GenerateOpaqueToken();
        user.PasswordResetTokenHash = TokenCrypto.Hash(plain);
        user.PasswordResetExpiresAt = DateTimeOffset.UtcNow.AddHours(1);
        await _users.SaveChangesAsync(cancellationToken);

        QueuePasswordResetEmail(user.Email, user.FullName, plain, user.PasswordResetExpiresAt.Value);

        if (_env.IsDevelopment())
        {
            _logger.LogWarning("Password reset token for {Email}: {Token}", email, plain);
        }
    }

    public async Task<bool> ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _users.GetByEmailTrackedAsync(email, cancellationToken);
        
        if (user is null || user.PasswordResetTokenHash is null || user.PasswordResetExpiresAt is null)
            return false;

        if (user.PasswordResetExpiresAt < DateTimeOffset.UtcNow)
            return false;

        var computedHash = TokenCrypto.Hash(request.Token);
        if (!FixedTimeHexEquals(user.PasswordResetTokenHash, computedHash))
            return false;

        user.PasswordHash = _passwordHasher.HashPassword(user, request.NewPassword);
        user.PasswordResetTokenHash = null;
        user.PasswordResetExpiresAt = null;
        user.UpdatedAt = DateTimeOffset.UtcNow;

        var refreshTokens = await _refreshTokens.ListActiveByUserIdAsync(user.Id, cancellationToken);
        foreach (var t in refreshTokens)
        {
            t.RevokedAtUtc = DateTimeOffset.UtcNow;
        }

        await _users.SaveChangesAsync(cancellationToken);
        QueuePasswordChangedEmail(user.Email, user.FullName);
        
        return true;
    }

    public async Task<UserProfileDto?> GetProfileAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _users.GetByIdTrackedAsync(userId, cancellationToken);
        
        return user is null ? null : user.ToProfileDto();
    }

    public async Task<UserProfileDto?> UpdateProfileAsync(Guid userId, UpdateProfileRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _users.GetByIdTrackedAsync(userId, cancellationToken);
        if (user is null)
            return null;

        user.FullName = request.FullName.Trim();
        user.Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();
        user.Country = string.IsNullOrWhiteSpace(request.Country) ? null : request.Country.Trim();
        user.UpdatedAt = DateTimeOffset.UtcNow;
        await _users.SaveChangesAsync(cancellationToken);

        return user.ToProfileDto();
    }

    private async Task<AuthResponse> IssueTokensAsync(User user, CancellationToken cancellationToken)
    {
        var (access, accessExp, _) = _jwt.CreateAccessToken(user);
        var refreshPlain = TokenCrypto.GenerateOpaqueToken();
        var refreshHash = TokenCrypto.Hash(refreshPlain);
        var refreshExp = DateTimeOffset.UtcNow.AddDays(_jwtOptions.RefreshTokenDays);

        await _refreshTokens.AddAsync(
            new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                TokenHash = refreshHash,
                ExpiresAtUtc = refreshExp,
                CreatedAtUtc = DateTimeOffset.UtcNow,
            },
            cancellationToken);

        await _refreshTokens.SaveChangesAsync(cancellationToken);

        return new AuthResponse(access, accessExp, refreshPlain, refreshExp, user.ToProfileDto());
    }

    private static bool FixedTimeHexEquals(string a, string b)
    {
        if (a.Length != b.Length)
            return false;

        var result = 0;
        for (var i = 0; i < a.Length; i++)
            result |= a[i] ^ b[i];

        return result == 0;
    }

    private void QueuePasswordResetEmail(string recipientEmail, string? recipientName, string plainToken, DateTimeOffset expiresAtUtc) =>
        _ = Task.Run(() => SendPasswordResetEmailInBackgroundAsync(recipientEmail, recipientName, plainToken, expiresAtUtc));

    private void QueueWelcomeEmail(string recipientEmail, string? recipientName) =>
        _ = Task.Run(() => SendWelcomeEmailInBackgroundAsync(recipientEmail, recipientName));

    private void QueuePasswordChangedEmail(string recipientEmail, string? recipientName) =>
        _ = Task.Run(() => SendPasswordChangedEmailInBackgroundAsync(recipientEmail, recipientName));

    private async Task SendPasswordResetEmailInBackgroundAsync(string recipientEmail, string? recipientName, string plainToken, DateTimeOffset expiresAtUtc)
    {
        try
        {
            await using var scope = _scopeFactory.CreateAsyncScope();
            var emails = scope.ServiceProvider.GetRequiredService<IEmailNotificationService>();
            await emails.SendPasswordResetAsync(new PasswordResetNotification(recipientEmail, recipientName, plainToken, expiresAtUtc));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send password reset email to {Email}.", recipientEmail);
        }
    }

    private async Task SendPasswordChangedEmailInBackgroundAsync(string recipientEmail, string? recipientName)
    {
        try
        {
            await using var scope = _scopeFactory.CreateAsyncScope();
            var emails = scope.ServiceProvider.GetRequiredService<IEmailNotificationService>();
            await emails.SendPasswordChangedAsync(new PasswordChangedNotification(recipientEmail, recipientName, DateTimeOffset.UtcNow));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send password changed email to {Email}.", recipientEmail);
        }
    }

    private async Task SendWelcomeEmailInBackgroundAsync(string recipientEmail, string? recipientName)
    {
        try
        {
            await using var scope = _scopeFactory.CreateAsyncScope();
            var emails = scope.ServiceProvider.GetRequiredService<IEmailNotificationService>();
            await emails.SendWelcomeAsync(new WelcomeNotification(recipientEmail, recipientName));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send welcome email to {Email}.", recipientEmail);
        }
    }
}
