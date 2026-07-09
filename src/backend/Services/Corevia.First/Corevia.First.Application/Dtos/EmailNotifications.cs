namespace Corevia.First.Application.Dtos;

public sealed record PasswordResetNotification(
    string RecipientEmail,
    string? RecipientName,
    string ResetToken,
    DateTimeOffset ExpiresAtUtc);

public sealed record PasswordChangedNotification(
    string RecipientEmail,
    string? RecipientName,
    DateTimeOffset ChangedAtUtc);

public sealed record WelcomeNotification(
    string RecipientEmail,
    string? RecipientName);

public sealed record AuthConfigDto(
    bool SupabaseEnabled,
    string? SupabaseUrl,
    string? SupabaseAnonKey);

public sealed record SupabaseSessionRequest(string AccessToken);

public sealed record SupabaseSessionResponse(UserProfileDto Profile);
