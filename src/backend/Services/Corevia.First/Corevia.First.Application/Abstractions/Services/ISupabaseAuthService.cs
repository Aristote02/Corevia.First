using Corevia.First.Application.Dtos;
using System.Security.Claims;

namespace Corevia.First.Application.Abstractions.Services;

public interface ISupabaseAuthService
{
    Task<UserProfileDto?> SyncSessionAsync(string accessToken, CancellationToken cancellationToken = default);
    Task<UserProfileDto?> ResolveLocalUserAsync(ClaimsPrincipal principal, CancellationToken cancellationToken = default);
}
