namespace Corevia.First.Domain.Entities;

public class VisaPackage
{
    public Guid Id { get; set; }

    public string Country { get; set; } = string.Empty;

    public string VisaType { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public string ProcessingTime { get; set; } = string.Empty;

    public string Validity { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public List<string> Features { get; set; } = [];

    public List<string> RequiredDocuments { get; set; } = [];

    public bool IsActive { get; set; } = true;

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }
}
