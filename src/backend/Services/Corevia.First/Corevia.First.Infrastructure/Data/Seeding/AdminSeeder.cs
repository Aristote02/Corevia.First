using Corevia.First.Application.Abstractions.Repositories;
using Corevia.First.Application.Configuration;
using Corevia.First.Domain.Entities;
using Corevia.First.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Corevia.First.Infrastructure.Data.Seeding;

public static class AdminSeeder
{
    public static async Task SeedAsync(IUserRepository users, IPasswordHasher<User> passwordHasher, IOptions<AdminSeedOptions> seedOptions,
        ILogger logger, CancellationToken cancellationToken = default)
    {
        var opts = seedOptions.Value;
        if (!opts.Enabled)
            return;

        if (string.IsNullOrWhiteSpace(opts.Email) || string.IsNullOrWhiteSpace(opts.Password))
        {
            logger.LogWarning("AdminSeed is enabled but Email or Password is not configured; skipping admin seed.");
            return;
        }

        if (await users.AnyInRoleAsync(UserRole.Admin, cancellationToken))
            return;

        var now = DateTimeOffset.UtcNow;
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = opts.Email.Trim().ToLowerInvariant(),
            Role = UserRole.Admin,
            FullName = opts.FullName.Trim(),
            IsSuperAdmin = true,
            CreatedAt = now,
            UpdatedAt = now,
        };
        user.PasswordHash = passwordHasher.HashPassword(user, opts.Password);

        await users.AddAsync(user, cancellationToken);
        await users.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Seeded admin user {Email}.", user.Email);
    }
}
