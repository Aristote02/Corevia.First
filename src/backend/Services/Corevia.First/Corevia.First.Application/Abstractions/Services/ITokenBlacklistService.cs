namespace Corevia.First.Application.Abstractions.Services;

public interface ITokenBlacklistService
{
    Task BlacklistAccessTokenAsync(string jti, DateTimeOffset accessTokenExpiresAtUtc, CancellationToken cancellationToken = default);

    Task<bool> IsAccessTokenBlacklistedAsync(string jti, CancellationToken cancellationToken = default);
}
