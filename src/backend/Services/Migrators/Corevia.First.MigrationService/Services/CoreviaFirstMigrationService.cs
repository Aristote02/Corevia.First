using Corevia.First.Infrastructure.Data;
using Corevia.First.Infrastructure.Services;

namespace Corevia.First.MigrationService.Services;

/// <summary>One-shot migration worker for <see cref="CoreviaFirstDbContext"/>.</summary>
public sealed class CoreviaFirstMigrationService : BaseMigrationService<CoreviaFirstDbContext>
{
    public CoreviaFirstMigrationService(
        IServiceProvider serviceProvider,
        IHostApplicationLifetime hostApplicationLifetime,
        ILogger<CoreviaFirstMigrationService> logger)
        : base(serviceProvider, hostApplicationLifetime, logger)
    {
    }
}
