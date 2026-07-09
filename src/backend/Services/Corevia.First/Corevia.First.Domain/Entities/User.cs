using Corevia.First.Domain.Enums;

namespace Corevia.First.Domain.Entities;

public class User
{
    public Guid Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public UserRole Role { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string? Country { get; set; }

    public bool IsSuperAdmin { get; set; }

    public Guid? SupabaseAuthId { get; set; }

    public DateTimeOffset CreatedAt { get; init; }

    public DateTimeOffset UpdatedAt { get; set; }

    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];

    public ICollection<Application> Applications { get; set; } = [];

    public string? PasswordResetTokenHash { get; set; }

    public DateTimeOffset? PasswordResetExpiresAt { get; set; }
}
