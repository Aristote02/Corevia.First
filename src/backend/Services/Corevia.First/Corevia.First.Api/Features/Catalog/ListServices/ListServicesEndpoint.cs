using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Domain.Entities;
using FastEndpoints;

namespace Corevia.First.Api.Features.Catalog.ListServices;

public sealed class ListServicesEndpoint : EndpointWithoutRequest<IReadOnlyList<AgencyService>>
{
    private readonly ICatalogService _catalog;

    public ListServicesEndpoint(ICatalogService catalog) => _catalog = catalog;

    public override void Configure()
    {
        Get("/api/services");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct) =>
        await Send.OkAsync(await _catalog.GetServicesAsync(ct), ct);
}
