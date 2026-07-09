using Corevia.First.Api.Authorization;
using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Profile.GetProfile;

public sealed class GetProfileEndpoint : EndpointWithoutRequest<UserProfileDto>
{
    private readonly IAuthService _auth;

    public GetProfileEndpoint(IAuthService auth) => _auth = auth;

    public override void Configure()
    {
        Get("/api/profile");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var profile = await _auth.GetProfileAsync(User.GetUserId(), ct);
        if (profile is null)
        {
            await Send.NotFoundAsync(ct);
            return;
        }

        await Send.OkAsync(profile, ct);
    }
}
