using System.Threading.Tasks;
using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Infrastructure.Services;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace Corevia.First.Infrastructure;

/// <summary>
/// Registers <see cref="IMemoryCache"/>, <see cref="Microsoft.Extensions.Caching.Distributed.IDistributedCache"/>,
/// and <see cref="ITokenBlacklistService"/>. Uses Redis when the server is reachable; otherwise memory-backed implementations.
/// </summary>
public static class CoreviaFirstCachingExtensions
{
    public static IServiceCollection AddCoreviaFirstCachingAndTokenBlacklistWithFallback(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddMemoryCache();

        var redisConn = RedisConnectionStringResolver.Resolve(configuration);

        if (string.IsNullOrWhiteSpace(redisConn))
        {
            services.AddDistributedMemoryCache();
            services.AddSingleton<ITokenBlacklistService, MemoryTokenBlacklistService>();
            return services;
        }

        if (!RedisConnectionProbe.TryConnect(redisConn, out var mux) || mux is null)
        {
            services.AddDistributedMemoryCache();
            services.AddSingleton<ITokenBlacklistService, MemoryTokenBlacklistService>();
            return services;
        }

        services.AddSingleton<IConnectionMultiplexer>(mux);

        services.AddStackExchangeRedisCache(options =>
        {
            var m = mux;
            options.ConnectionMultiplexerFactory = () => Task.FromResult<IConnectionMultiplexer>(m);
        });

        services.AddSingleton<ITokenBlacklistService, RedisTokenBlacklistService>();
        return services;
    }
}
