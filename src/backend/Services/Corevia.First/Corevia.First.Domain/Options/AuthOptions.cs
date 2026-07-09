namespace Corevia.First.Domain.Options;

public sealed class AuthOptions : ICoreviaFirstOptions
{
    public static string SectionName => "Jwt";

    /// <summary>Optional Swagger UI OAuth (PKCE). Requires <see cref="Authority"/> when set.</summary>
    public string? SwaggerClientId { get; set; }

    /// <summary>OAuth/OIDC authority base URL for Swagger.</summary>
    public string? Authority { get; set; }
}
