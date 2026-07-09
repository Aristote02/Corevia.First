using Corevia.First.Application.Abstractions.Repositories;
using Corevia.First.Domain.Entities;
using Corevia.First.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Corevia.First.Infrastructure.Data.Repositories;

public sealed class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(CoreviaFirstDbContext context) : base(context) { }

    public Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken) =>
        Query().AsNoTracking().AnyAsync(u => u.Email == email, cancellationToken);

    public Task<bool> AnyInRoleAsync(UserRole role, CancellationToken cancellationToken) =>
        Query().AsNoTracking().AnyAsync(u => u.Role == role, cancellationToken);

    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken) =>
        Query().AsNoTracking().FirstOrDefaultAsync(u => u.Email == email, cancellationToken);

    public Task<User?> GetByEmailTrackedAsync(string email, CancellationToken cancellationToken) =>
        Query().FirstOrDefaultAsync(u => u.Email == email, cancellationToken);

    public Task<User?> GetBySupabaseAuthIdTrackedAsync(Guid supabaseAuthId, CancellationToken cancellationToken) =>
        Query().FirstOrDefaultAsync(u => u.SupabaseAuthId == supabaseAuthId, cancellationToken);

    public Task<User?> GetByIdTrackedAsync(Guid id, CancellationToken cancellationToken) =>
        Query().FirstOrDefaultAsync(u => u.Id == id, cancellationToken);

    public Task<List<User>> GetAllCreatedDescAsync(CancellationToken cancellationToken) =>
        Query().AsNoTracking()
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync(cancellationToken);
}
