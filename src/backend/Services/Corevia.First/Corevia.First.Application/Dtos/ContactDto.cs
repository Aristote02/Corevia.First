namespace Corevia.First.Application.Dtos;

public record ContactDto(
    Guid Id,
    string Name,
    string Email,
    string? Phone,
    string? Country,
    string Message,
    string Status,
    DateTimeOffset CreatedAt);
