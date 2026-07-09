using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Admin.GetAdminOverview;

public sealed class GetAdminOverviewEndpoint : EndpointWithoutRequest<AdminOverviewStatsDto>
{
    private readonly IApplicationService _applications;

    public GetAdminOverviewEndpoint(IApplicationService applications) => _applications = applications;

    public override void Configure()
    {
        Get("/api/admin/overview");
        Policies("Admin");
    }

    public override async Task HandleAsync(CancellationToken ct) =>
        await Send.OkAsync(await _applications.GetOverviewStatsAsync(ct), ct);
}
