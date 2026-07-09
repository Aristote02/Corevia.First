using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Domain.Entities;
using FastEndpoints;

namespace Corevia.First.Api.Features.Catalog.ListFaqs;

public sealed class ListFaqsEndpoint : EndpointWithoutRequest<IReadOnlyList<Faq>>
{
    private readonly ICatalogService _catalog;

    public ListFaqsEndpoint(ICatalogService catalog) => _catalog = catalog;

    public override void Configure()
    {
        Get("/api/faqs");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct) =>
        await Send.OkAsync(await _catalog.GetFaqsAsync(ct), ct);
}
