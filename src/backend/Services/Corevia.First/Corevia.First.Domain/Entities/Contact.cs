using Corevia.First.Domain.Constants;

namespace Corevia.First.Domain.Entities;

public class Contact
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string? Country { get; set; }

    public string Message { get; set; } = string.Empty;

    public string Status { get; set; } = ContactStatuses.Nouveau;

    public DateTimeOffset CreatedAt { get; set; }
}
