namespace Corevia.First.Application.Dtos;

public record ApplicationDto(
    Guid Id,
    string ApplicationNumber,
    string FullName,
    string Email,
    string? Phone,
    string? Country,
    string? Service,
    string Message,
    string Status,
    string AdminStatus,
    string AdminNotes,
    Guid? UserId,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);
