using Corevia.First.Api.Authorization;
using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Applications.SubmitApplication;

public sealed class SubmitApplicationEndpoint : Endpoint<SubmitApplicationRequest, ApplicationDto>
{
    private readonly IApplicationService _applications;

    public SubmitApplicationEndpoint(IApplicationService applications) => _applications = applications;

    public override void Configure()
    {
        Post("/api/applications/submit");
        AllowAnonymous();
    }

    public override async Task HandleAsync(SubmitApplicationRequest req, CancellationToken ct)
    {
        if (User.Identity?.IsAuthenticated == true)
            req = req with { UserId = User.GetUserId() };

        var result = await _applications.SubmitAsync(req, ct);
        await Send.OkAsync(result, ct);
    }
}
