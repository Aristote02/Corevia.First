namespace Corevia.First.Application.Configuration;

/// <summary>Travel-agency application settings. Domain-specific values will be added as features are implemented.</summary>
public class CoreviaFirstOptions
{
    public const string SectionName = "CoreviaFirst";

    public string DefaultCurrency { get; set; } = "USD";
}
