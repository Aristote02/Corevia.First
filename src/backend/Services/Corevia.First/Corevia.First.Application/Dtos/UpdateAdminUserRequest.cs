namespace Corevia.First.Application.Dtos;

public record UpdateAdminUserRequest(
    Guid UserId,
    string FullName,
    bool IsSuperAdmin,
    string? Role = null);
