using Corevia.First.Domain.Entities;

namespace Corevia.First.Application.Abstractions.Repositories;

public interface IRefreshTokenRepository : IRepository<RefreshToken>
{
    Task<RefreshToken?> FindActiveByTokenHashWithUserAsync(string tokenHash, CancellationToken cancellationToken = default);
    Task<List<RefreshToken>> ListActiveByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
}
