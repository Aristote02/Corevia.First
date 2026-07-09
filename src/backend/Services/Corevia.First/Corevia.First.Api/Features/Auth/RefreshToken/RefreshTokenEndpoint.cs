using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Auth.RefreshToken;

public sealed class RefreshTokenEndpoint : Endpoint<RefreshTokenRequest, AuthResponse>
{
    private readonly IAuthService _auth;

    public RefreshTokenEndpoint(IAuthService auth) => _auth = auth;

    public override void Configure()
    {
        Post("/api/auth/refresh");
        AllowAnonymous();
    }

    public override async Task HandleAsync(RefreshTokenRequest req, CancellationToken ct)
    {
        var result = await _auth.RefreshAsync(req, ct);
        if (result is null)
        {
            await Send.UnauthorizedAsync(ct);
            return;
        }

        await Send.OkAsync(result, ct);
    }
}
