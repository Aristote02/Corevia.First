using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Applications.ListApplicationsAdmin;

public sealed class ListApplicationsAdminEndpoint : Endpoint<ListApplicationsAdminRequest, PagedResponse<ApplicationDto>>
{
    private readonly IApplicationService _applications;

    public ListApplicationsAdminEndpoint(IApplicationService applications) => _applications = applications;

    public override void Configure()
    {
        Get("/api/admin/applications");
        Policies("Admin");
    }

    public override async Task HandleAsync(ListApplicationsAdminRequest req, CancellationToken ct)
    {
        var result = await _applications.ListAsync(req.Page, req.PageSize, req.Status, req.Search, ct);
        await Send.OkAsync(result, ct);
    }
}
