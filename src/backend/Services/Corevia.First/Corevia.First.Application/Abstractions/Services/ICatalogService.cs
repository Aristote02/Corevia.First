using Corevia.First.Domain.Entities;

namespace Corevia.First.Application.Abstractions.Services;

public interface ICatalogService
{
    Task<IReadOnlyList<Destination>> GetDestinationsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AgencyService>> GetServicesAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Faq>> GetFaqsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<VisaPackage>> GetVisaPackagesAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Statistic>> GetStatisticsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<GalleryUniversity>> GetGalleryUniversitiesAsync(CancellationToken cancellationToken = default);
}
