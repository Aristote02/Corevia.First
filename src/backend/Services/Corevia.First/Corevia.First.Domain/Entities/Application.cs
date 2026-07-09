using Corevia.First.Domain.Constants;

namespace Corevia.First.Domain.Entities;

public class Application
{
    public Guid Id { get; set; }

    public Guid? UserId { get; set; }

    public User? User { get; set; }

    public string ApplicationNumber { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string? Country { get; set; }

    public string? Service { get; set; }

    public string Message { get; set; } = string.Empty;

    public string Status { get; set; } = ApplicationStatuses.User.Nouveau;

    public string AdminStatus { get; set; } = ApplicationStatuses.Admin.Nouveau;

    public string AdminNotes { get; set; } = string.Empty;

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }

    public ICollection<ApplicationHistory> History { get; set; } = [];
}
