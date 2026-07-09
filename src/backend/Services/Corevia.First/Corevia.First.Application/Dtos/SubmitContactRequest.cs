namespace Corevia.First.Application.Dtos;

public record SubmitContactRequest(
    string Name,
    string Email,
    string? Phone,
    string? Country,
    string Message);
