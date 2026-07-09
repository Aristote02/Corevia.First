namespace Corevia.First.Domain.Entities;

public class AgencyService
{
    public Guid Id { get; set; }

    public string ServiceNameFr { get; set; } = string.Empty;

    public string ServiceNameEn { get; set; } = string.Empty;

    public string DescriptionFr { get; set; } = string.Empty;

    public string DescriptionEn { get; set; } = string.Empty;

    public decimal? Price { get; set; }

    public List<string> Features { get; set; } = [];

    public string IconName { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
}
