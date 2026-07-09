namespace Corevia.First.Domain.Options;

public sealed record SupabaseOptions : ICoreviaFirstOptions
{
    public static string SectionName => "Supabase";

    public bool Enabled { get; init; }
    public string ProjectUrl { get; init; } = string.Empty;
    public string AnonKey { get; init; } = string.Empty;
    public string JwtAudience { get; init; } = "authenticated";
}
