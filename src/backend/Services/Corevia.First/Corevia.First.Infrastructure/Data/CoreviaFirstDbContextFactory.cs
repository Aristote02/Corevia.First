using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Corevia.First.Infrastructure.Data;

/// <summary>Design-time factory for <c>dotnet ef</c> (connection string from env or local dev default).</summary>
public sealed class CoreviaFirstDbContextFactory : IDesignTimeDbContextFactory<CoreviaFirstDbContext>
{
    public CoreviaFirstDbContext CreateDbContext(string[] args)
    {
        var connectionString =
            Environment.GetEnvironmentVariable("ConnectionStrings__CoreviaFirstDbConnectionString")
            ?? "Host=localhost;Port=5432;Database=CoreviaFirst;Username=postgres;Password=postgres";

        var optionsBuilder = new DbContextOptionsBuilder<CoreviaFirstDbContext>();
        optionsBuilder.UseNpgsql(connectionString);
        return new CoreviaFirstDbContext(optionsBuilder.Options);
    }
}
