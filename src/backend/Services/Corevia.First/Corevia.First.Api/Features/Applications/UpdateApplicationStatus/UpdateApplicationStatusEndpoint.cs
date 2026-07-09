using Corevia.First.Api.Authorization;
using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Applications.UpdateApplicationStatus;

public sealed class UpdateApplicationStatusEndpoint : Endpoint<UpdateApplicationStatusRequest, ApplicationDto>
{
    private readonly IApplicationService _applications;

    public UpdateApplicationStatusEndpoint(IApplicationService applications) => _applications = applications;

    public override void Configure()
    {
        Patch("/api/admin/applications/{Id}/status");
        Policies("Admin");
    }

    public override async Task HandleAsync(UpdateApplicationStatusRequest req, CancellationToken ct)
    {
        var result = await _applications.UpdateAdminStatusAsync(req.Id, User.GetUserId(), req.AdminStatus, req.Notes, ct);
        if (result is null)
        {
            await Send.NotFoundAsync(ct);
            return;
        }

        await Send.OkAsync(result, ct);
    }
}
