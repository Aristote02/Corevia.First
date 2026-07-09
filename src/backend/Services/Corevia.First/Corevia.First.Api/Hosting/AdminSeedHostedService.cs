using Corevia.First.Application.Abstractions.Repositories;
using Corevia.First.Application.Configuration;
using Corevia.First.Domain.Entities;
using Corevia.First.Infrastructure.Data.Seeding;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Corevia.First.Api.Hosting;

public sealed class AdminSeedHostedService : IHostedService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public AdminSeedHostedService(IServiceScopeFactory scopeFactory) => _scopeFactory = scopeFactory;

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await using var scope = _scopeFactory.CreateAsyncScope();
        var users = scope.ServiceProvider.GetRequiredService<IUserRepository>();
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();
        var options = scope.ServiceProvider.GetRequiredService<IOptions<AdminSeedOptions>>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<AdminSeedHostedService>>();

        await AdminSeeder.SeedAsync(users, hasher, options, logger, cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
