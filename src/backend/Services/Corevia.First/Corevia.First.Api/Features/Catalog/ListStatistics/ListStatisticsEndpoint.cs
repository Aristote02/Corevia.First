using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Domain.Entities;
using FastEndpoints;

namespace Corevia.First.Api.Features.Catalog.ListStatistics;

public sealed class ListStatisticsEndpoint : EndpointWithoutRequest<IReadOnlyList<Statistic>>
{
    private readonly ICatalogService _catalog;

    public ListStatisticsEndpoint(ICatalogService catalog) => _catalog = catalog;

    public override void Configure()
    {
        Get("/api/statistics");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct) =>
        await Send.OkAsync(await _catalog.GetStatisticsAsync(ct), ct);
}
