using Corevia.First.Application.Abstractions.Services;
using FastEndpoints;

namespace Corevia.First.Api.Features.Applications.DeleteApplication;

public sealed class DeleteApplicationEndpoint : Endpoint<DeleteApplicationRequest>
{
    private readonly IApplicationService _applications;

    public DeleteApplicationEndpoint(IApplicationService applications) => _applications = applications;

    public override void Configure()
    {
        Delete("/api/admin/applications/{Id}");
        Policies("Admin");
    }

    public override async Task HandleAsync(DeleteApplicationRequest req, CancellationToken ct)
    {
        var deleted = await _applications.DeleteAsync(req.Id, ct);
        if (!deleted)
        {
            await Send.NotFoundAsync(ct);
            return;
        }

        await Send.NoContentAsync(ct);
    }
}
