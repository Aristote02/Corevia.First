namespace Corevia.First.Application.Dtos;

public record ApplicationHistoryDto(
    Guid Id,
    string? OldStatus,
    string NewStatus,
    string? Notes,
    DateTimeOffset CreatedAt,
    Guid? ChangedBy);
