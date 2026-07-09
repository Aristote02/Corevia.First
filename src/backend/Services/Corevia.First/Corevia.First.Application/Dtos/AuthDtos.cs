using System.ComponentModel.DataAnnotations;

namespace Corevia.First.Application.Dtos;

public record AuthResponse(
    string AccessToken,
    DateTimeOffset AccessExpiresAtUtc,
    string RefreshToken,
    DateTimeOffset RefreshExpiresAtUtc,
    UserProfileDto Profile);

public record UserProfileDto(
    Guid Id,
    string Email,
    string FullName,
    string Role,
    string? Phone,
    string? Country,
    bool IsSuperAdmin,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);

public record SignInRequest(
    [property: Required, EmailAddress] string Email,
    [property: Required, MinLength(6)] string Password);

public record SignUpRequest(
    [property: Required, MinLength(2)] string FullName,
    [property: Required, EmailAddress] string Email,
    [property: Required, MinLength(6)] string Password);

public record RefreshTokenRequest([property: Required] string RefreshToken);

public record ForgotPasswordRequest([property: Required, EmailAddress] string Email);

public record ResetPasswordRequest(
    [property: Required, EmailAddress] string Email,
    [property: Required] string Token,
    [property: Required, MinLength(6)] string NewPassword);

public record UpdateProfileRequest(
    [property: Required, MinLength(2)] string FullName,
    string? Phone,
    string? Country);
