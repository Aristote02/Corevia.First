namespace Corevia.First.Domain.Entities;

public class GalleryUniversity
{
    public Guid Id { get; set; }

    public string NameFr { get; set; } = string.Empty;

    public string NameEn { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    public string LocationFr { get; set; } = string.Empty;

    public string LocationEn { get; set; } = string.Empty;

    public string ProgramsFr { get; set; } = string.Empty;

    public string ProgramsEn { get; set; } = string.Empty;

    public string TuitionFees { get; set; } = string.Empty;

    public string DurationFr { get; set; } = string.Empty;

    public string DurationEn { get; set; } = string.Empty;

    public List<string> AdmissionRequirementsFr { get; set; } = [];

    public List<string> AdmissionRequirementsEn { get; set; } = [];

    public List<string> FacilitiesFr { get; set; } = [];

    public List<string> FacilitiesEn { get; set; } = [];

    public string? LanguageFr { get; set; }

    public string? LanguageEn { get; set; }

    public string? AccreditationFr { get; set; }

    public string? AccreditationEn { get; set; }

    public string Category { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }
}
