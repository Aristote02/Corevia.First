using Corevia.First.Domain.Entities;

namespace Corevia.First.Application.Abstractions.Services;

public interface IJwtTokenGenerator
{
    (string AccessToken, DateTimeOffset AccessExpiresAtUtc, string Jti) CreateAccessToken(User user);
}
