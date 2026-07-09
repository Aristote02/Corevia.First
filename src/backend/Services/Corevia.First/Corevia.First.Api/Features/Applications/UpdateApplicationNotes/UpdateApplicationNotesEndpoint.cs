using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Applications.UpdateApplicationNotes;

public sealed class UpdateApplicationNotesEndpoint : Endpoint<UpdateApplicationNotesRequest, ApplicationDto>
{
    private readonly IApplicationService _applications;

    public UpdateApplicationNotesEndpoint(IApplicationService applications) => _applications = applications;

    public override void Configure()
    {
        Patch("/api/admin/applications/{Id}/notes");
        Policies("Admin");
    }

    public override async Task HandleAsync(UpdateApplicationNotesRequest req, CancellationToken ct)
    {
        var result = await _applications.UpdateNotesAsync(req.Id, req.AdminNotes, ct);
        if (result is null)
        {
            await Send.NotFoundAsync(ct);
            return;
        }

        await Send.OkAsync(result, ct);
    }
}
