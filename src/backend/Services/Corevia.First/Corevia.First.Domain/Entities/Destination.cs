namespace Corevia.First.Domain.Entities;

public class Destination
{
    public Guid Id { get; set; }

    public string NameFr { get; set; } = string.Empty;

    public string NameEn { get; set; } = string.Empty;

    public string CountryCode { get; set; } = string.Empty;

    public bool IsFeatured { get; set; }

    public string Budget { get; set; } = string.Empty;

    public string DurationFr { get; set; } = string.Empty;

    public string DurationEn { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    public List<string> HighlightsFr { get; set; } = [];

    public List<string> HighlightsEn { get; set; } = [];

    public List<string> UniversitiesFr { get; set; } = [];

    public List<string> UniversitiesEn { get; set; } = [];

    public List<string> PopularProgramsFr { get; set; } = [];

    public List<string> PopularProgramsEn { get; set; } = [];

    public string? LivingCost { get; set; }

    public string? LanguageFr { get; set; }

    public string? LanguageEn { get; set; }

    public string? VisaRequirementsFr { get; set; }

    public string? VisaRequirementsEn { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }
}
