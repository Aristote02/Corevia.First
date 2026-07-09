using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Domain.Entities;
using FastEndpoints;

namespace Corevia.First.Api.Features.Catalog.ListVisaPackages;

public sealed class ListVisaPackagesEndpoint : EndpointWithoutRequest<IReadOnlyList<VisaPackage>>
{
    private readonly ICatalogService _catalog;

    public ListVisaPackagesEndpoint(ICatalogService catalog) => _catalog = catalog;

    public override void Configure()
    {
        Get("/api/visa-packages");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct) =>
        await Send.OkAsync(await _catalog.GetVisaPackagesAsync(ct), ct);
}
