using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Applications.GetApplicationHistory;

public sealed class GetApplicationHistoryEndpoint : Endpoint<GetApplicationHistoryRequest, IReadOnlyList<ApplicationHistoryDto>>
{
    private readonly IApplicationService _applications;

    public GetApplicationHistoryEndpoint(IApplicationService applications) => _applications = applications;

    public override void Configure()
    {
        Get("/api/admin/applications/{Id}/history");
        Policies("Admin");
    }

    public override async Task HandleAsync(GetApplicationHistoryRequest req, CancellationToken ct)
    {
        var history = await _applications.GetHistoryAsync(req.Id, ct);
        await Send.OkAsync(history, ct);
    }
}
