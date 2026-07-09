namespace Corevia.First.Application.Dtos;

public record SubmitApplicationRequest(
    string FullName,
    string Email,
    string? Phone,
    string Country,
    string Service,
    string Message,
    Guid? UserId);
