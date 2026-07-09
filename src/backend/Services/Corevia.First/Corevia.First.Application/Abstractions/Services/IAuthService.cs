using Corevia.First.Application.Dtos;

namespace Corevia.First.Application.Abstractions.Services;

public interface IAuthService
{
    Task<AuthResponse?> SignUpAsync(SignUpRequest request, CancellationToken cancellationToken = default);
    Task<AuthResponse?> SignInAsync(SignInRequest request, CancellationToken cancellationToken = default);
    Task<AuthResponse?> RefreshAsync(RefreshTokenRequest request, CancellationToken cancellationToken = default);
    Task SignOutAsync(Guid userId, string accessTokenJti, DateTimeOffset accessExpiresAtUtc, CancellationToken cancellationToken = default);
    Task ForgotPasswordAsync(ForgotPasswordRequest request, CancellationToken cancellationToken = default);
    Task<bool> ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken = default);
    Task<UserProfileDto?> GetProfileAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<UserProfileDto?> UpdateProfileAsync(Guid userId, UpdateProfileRequest request, CancellationToken cancellationToken = default);
}
