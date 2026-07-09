using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Domain.Entities;
using FastEndpoints;

namespace Corevia.First.Api.Features.Catalog.ListGalleryUniversities;

public sealed class ListGalleryUniversitiesEndpoint : EndpointWithoutRequest<IReadOnlyList<GalleryUniversity>>
{
    private readonly ICatalogService _catalog;

    public ListGalleryUniversitiesEndpoint(ICatalogService catalog) => _catalog = catalog;

    public override void Configure()
    {
        Get("/api/gallery-universities");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct) =>
        await Send.OkAsync(await _catalog.GetGalleryUniversitiesAsync(ct), ct);
}
