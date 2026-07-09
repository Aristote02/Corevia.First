namespace Corevia.First.Application.Dtos;

public record AdminUserDto(
    Guid Id,
    string Email,
    string FullName,
    string Role,
    string? Phone,
    string? Country,
    bool IsSuperAdmin,
    int ApplicationsCount,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);
