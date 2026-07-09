using Corevia.First.Application.Dtos;

namespace Corevia.First.Application.Abstractions.Services;

public interface IAdminUserService
{
    Task<IReadOnlyList<AdminUserDto>> ListUsersAsync(CancellationToken cancellationToken = default);
    Task<AdminUserDto?> UpdateUserAsync(Guid callerId, UpdateAdminUserRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteUserAsync(Guid callerId, Guid targetUserId, CancellationToken cancellationToken = default);
}
