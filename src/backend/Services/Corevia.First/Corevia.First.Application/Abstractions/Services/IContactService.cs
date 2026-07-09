using Corevia.First.Application.Dtos;

namespace Corevia.First.Application.Abstractions.Services;

public interface IContactService
{
    Task<ContactDto> SubmitAsync(SubmitContactRequest request, CancellationToken cancellationToken = default);
    Task<PagedResponse<ContactDto>> ListAsync(int page, int pageSize, CancellationToken cancellationToken = default);
    Task<ContactDto?> UpdateStatusAsync(Guid id, string status, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
