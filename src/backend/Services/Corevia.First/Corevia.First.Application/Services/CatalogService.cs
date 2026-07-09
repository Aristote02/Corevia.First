using Corevia.First.Application.Abstractions.Repositories;
using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Corevia.First.Application.Services;

public sealed class CatalogService : ICatalogService
{
    private readonly IRepository<Destination> _destinations;
    private readonly IRepository<AgencyService> _services;
    private readonly IRepository<Faq> _faqs;
    private readonly IRepository<VisaPackage> _visaPackages;
    private readonly IRepository<Statistic> _statistics;
    private readonly IRepository<GalleryUniversity> _gallery;

    public CatalogService(
        IRepository<Destination> destinations,
        IRepository<AgencyService> services,
        IRepository<Faq> faqs,
        IRepository<VisaPackage> visaPackages,
        IRepository<Statistic> statistics,
        IRepository<GalleryUniversity> gallery)
    {
        _destinations = destinations;
        _services = services;
        _faqs = faqs;
        _visaPackages = visaPackages;
        _statistics = statistics;
        _gallery = gallery;
    }

    public async Task<IReadOnlyList<Destination>> GetDestinationsAsync(CancellationToken cancellationToken = default) =>
        await _destinations.Query().AsNoTracking()
            .Where(d => d.IsActive)
            .OrderBy(d => d.DisplayOrder)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<AgencyService>> GetServicesAsync(CancellationToken cancellationToken = default) =>
        await _services.Query().AsNoTracking()
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Faq>> GetFaqsAsync(CancellationToken cancellationToken = default) =>
        await _faqs.Query().AsNoTracking()
            .Where(f => f.IsActive)
            .OrderBy(f => f.DisplayOrder)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<VisaPackage>> GetVisaPackagesAsync(CancellationToken cancellationToken = default) =>
        await _visaPackages.Query().AsNoTracking()
            .Where(v => v.IsActive)
            .OrderBy(v => v.Country)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Statistic>> GetStatisticsAsync(CancellationToken cancellationToken = default) =>
        await _statistics.Query().AsNoTracking()
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<GalleryUniversity>> GetGalleryUniversitiesAsync(CancellationToken cancellationToken = default) =>
        await _gallery.Query().AsNoTracking()
            .Where(g => g.IsActive)
            .OrderBy(g => g.Category)
            .ThenBy(g => g.DisplayOrder)
            .ToListAsync(cancellationToken);
}
