using Corevia.First.Application.Abstractions.Repositories;
using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using Corevia.First.Application.Mapping;
using ApplicationEntity = Corevia.First.Domain.Entities.Application;
using Corevia.First.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Corevia.First.Application.Services;

public sealed class AdminUserService : IAdminUserService
{
    private readonly IUserRepository _users;
    private readonly IRepository<ApplicationEntity> _applications;

    public AdminUserService(IUserRepository users, IRepository<ApplicationEntity> applications)
    {
        _users = users;
        _applications = applications;
    }

    public async Task<IReadOnlyList<AdminUserDto>> ListUsersAsync(CancellationToken cancellationToken = default)
    {
        var users = await _users.GetAllCreatedDescAsync(cancellationToken);
        var userIds = users.Select(u => u.Id).ToList();

        var counts = await _applications.Query().AsNoTracking()
            .Where(a => a.UserId != null && userIds.Contains(a.UserId.Value))
            .GroupBy(a => a.UserId)
            .Select(g => new { UserId = g.Key!.Value, Count = g.Count() })
            .ToListAsync(cancellationToken);

        var countMap = counts.ToDictionary(x => x.UserId, x => x.Count);

        return users
            .Select(u => u.ToAdminUserDto(countMap.GetValueOrDefault(u.Id)))
            .ToList();
    }

    public async Task<AdminUserDto?> UpdateUserAsync(Guid callerId, UpdateAdminUserRequest request, CancellationToken cancellationToken = default)
    {
        var caller = await _users.GetByIdTrackedAsync(callerId, cancellationToken);
        
        if (caller is null || !caller.IsSuperAdmin)
            return null;

        if (request.UserId == callerId)
            return null;

        var user = await _users.GetByIdTrackedAsync(request.UserId, cancellationToken);
        if (user is null)
            return null;

        user.FullName = request.FullName.Trim();
        user.IsSuperAdmin = request.IsSuperAdmin;
        
        if (!string.IsNullOrWhiteSpace(request.Role))
        {
            user.Role = request.Role.Equals("admin", StringComparison.OrdinalIgnoreCase)
                ? UserRole.Admin
                : UserRole.Client;
        }
        
        user.UpdatedAt = DateTimeOffset.UtcNow;
        await _users.SaveChangesAsync(cancellationToken);

        var appCount = await _applications.CountAsync(a => a.UserId == user.Id, cancellationToken);

        return user.ToAdminUserDto(appCount);
    }

    public async Task<bool> DeleteUserAsync(Guid callerId, Guid targetUserId, CancellationToken cancellationToken = default)
    {
        var caller = await _users.GetByIdTrackedAsync(callerId, cancellationToken);
        
        if (caller is null || !caller.IsSuperAdmin)
            return false;

        if (callerId == targetUserId)
            return false;

        var target = await _users.GetByIdTrackedAsync(targetUserId, cancellationToken);
        if (target is null || target.IsSuperAdmin)
            return false;

        await _users.DeleteAsync(target, cancellationToken);
        await _users.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}
