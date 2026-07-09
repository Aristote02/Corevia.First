using Corevia.First.Api.Authorization;
using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Applications.ListMyApplications;

public sealed class ListMyApplicationsEndpoint : EndpointWithoutRequest<IReadOnlyList<ApplicationDto>>
{
    private readonly IApplicationService _applications;

    public ListMyApplicationsEndpoint(IApplicationService applications) => _applications = applications;

    public override void Configure()
    {
        Get("/api/applications/mine");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var items = await _applications.ListByUserAsync(User.GetUserId(), ct);
        await Send.OkAsync(items, ct);
    }
}
