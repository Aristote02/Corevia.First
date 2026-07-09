using Corevia.First.Api.Authorization;
using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Profile.UpdateProfile;

public sealed class UpdateProfileEndpoint : Endpoint<UpdateProfileRequest, UserProfileDto>
{
    private readonly IAuthService _auth;

    public UpdateProfileEndpoint(IAuthService auth) => _auth = auth;

    public override void Configure()
    {
        Put("/api/profile");
    }

    public override async Task HandleAsync(UpdateProfileRequest req, CancellationToken ct)
    {
        var profile = await _auth.UpdateProfileAsync(User.GetUserId(), req, ct);
        if (profile is null)
        {
            await Send.NotFoundAsync(ct);
            return;
        }

        await Send.OkAsync(profile, ct);
    }
}
