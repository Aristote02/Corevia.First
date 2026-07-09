using Corevia.First.Application.Dtos;

namespace Corevia.First.Application.Abstractions.Services;

public interface IApplicationService
{
    Task<ApplicationDto> SubmitAsync(SubmitApplicationRequest request, CancellationToken cancellationToken = default);
    Task<PagedResponse<ApplicationDto>> ListAsync(int page, int pageSize, string? statusFilter, string? search, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ApplicationDto>> ListByUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<ApplicationDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ApplicationDto?> UpdateAdminStatusAsync(Guid id, Guid adminUserId, string adminStatus, string? notes, CancellationToken cancellationToken = default);
    Task<ApplicationDto?> UpdateNotesAsync(Guid id, string adminNotes, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ApplicationHistoryDto>> GetHistoryAsync(Guid applicationId, CancellationToken cancellationToken = default);
    Task<AdminOverviewStatsDto> GetOverviewStatsAsync(CancellationToken cancellationToken = default);
}
