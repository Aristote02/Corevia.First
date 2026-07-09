namespace Corevia.First.Domain.Options;

public sealed record ConnectionStringsOptions : ICoreviaFirstOptions
{
    public static string SectionName => "ConnectionStrings";

    public required string CoreviaFirstDbConnectionString { get; init; }

    public string? RedisConnectionString { get; init; }
}
