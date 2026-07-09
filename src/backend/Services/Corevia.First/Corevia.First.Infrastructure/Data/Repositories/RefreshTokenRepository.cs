using Corevia.First.Application.Abstractions.Repositories;
using Corevia.First.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Corevia.First.Infrastructure.Data.Repositories;

public sealed class RefreshTokenRepository : Repository<RefreshToken>, IRefreshTokenRepository
{
    public RefreshTokenRepository(CoreviaFirstDbContext context) : base(context) { }

    public Task<RefreshToken?> FindActiveByTokenHashWithUserAsync(string tokenHash, CancellationToken cancellationToken) =>
        Query()
            .Include(t => t.User)
            .FirstOrDefaultAsync(
                t => t.TokenHash == tokenHash
                     && t.RevokedAtUtc == null
                     && t.ExpiresAtUtc > DateTimeOffset.UtcNow,
                cancellationToken);

    public Task<List<RefreshToken>> ListActiveByUserIdAsync(Guid userId, CancellationToken cancellationToken) =>
        Query()
            .Where(t => t.UserId == userId && t.RevokedAtUtc == null && t.ExpiresAtUtc > DateTimeOffset.UtcNow)
            .ToListAsync(cancellationToken);
}
