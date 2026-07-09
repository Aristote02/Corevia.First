using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Domain.Entities;
using FastEndpoints;

namespace Corevia.First.Api.Features.Catalog.ListDestinations;

public sealed class ListDestinationsEndpoint : EndpointWithoutRequest<IReadOnlyList<Destination>>
{
    private readonly ICatalogService _catalog;

    public ListDestinationsEndpoint(ICatalogService catalog) => _catalog = catalog;

    public override void Configure()
    {
        Get("/api/destinations");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct) =>
        await Send.OkAsync(await _catalog.GetDestinationsAsync(ct), ct);
}
