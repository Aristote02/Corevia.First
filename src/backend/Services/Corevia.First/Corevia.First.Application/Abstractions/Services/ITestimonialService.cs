using Corevia.First.Application.Dtos;

namespace Corevia.First.Application.Abstractions.Services;

public interface ITestimonialService
{
    Task<IReadOnlyList<TestimonialDto>> ListApprovedAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<TestimonialDto>> ListAllAsync(CancellationToken cancellationToken = default);
    Task<TestimonialDto> SubmitAsync(Guid userId, string studentName, SubmitTestimonialRequest request, CancellationToken cancellationToken = default);
    Task<TestimonialDto?> ToggleActiveAsync(Guid id, CancellationToken cancellationToken = default);
    Task<TestimonialDto?> ToggleFeaturedAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
