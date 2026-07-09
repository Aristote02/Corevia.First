namespace Corevia.First.Domain.Entities;

public class ApplicationHistory
{
    public Guid Id { get; set; }

    public Guid ApplicationId { get; set; }

    public Application Application { get; set; } = null!;

    public string? OldStatus { get; set; }

    public string NewStatus { get; set; } = string.Empty;

    public Guid? ChangedBy { get; set; }

    public User? ChangedByUser { get; set; }

    public string? Notes { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
}
