using Corevia.First.Infrastructure;

namespace Corevia.First.Api.Configuration;

/// <summary>
/// Application entry for distributed cache + token blacklist. Delegates to Infrastructure (Redis with in-memory fallback).
/// </summary>
public static class CacheConfiguration
{
    public static IServiceCollection ConfigureCache(this IServiceCollection services, IConfiguration configuration) =>
        services.AddCoreviaFirstCachingAndTokenBlacklistWithFallback(configuration);
}
