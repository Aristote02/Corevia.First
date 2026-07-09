using Corevia.First.Domain.Entities;
using Corevia.First.Domain.Enums;

namespace Corevia.First.Application.Abstractions.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<bool> AnyInRoleAsync(UserRole role, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailTrackedAsync(string email, CancellationToken cancellationToken = default);
    Task<User?> GetBySupabaseAuthIdTrackedAsync(Guid supabaseAuthId, CancellationToken cancellationToken = default);
    Task<User?> GetByIdTrackedAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<User>> GetAllCreatedDescAsync(CancellationToken cancellationToken = default);
}
