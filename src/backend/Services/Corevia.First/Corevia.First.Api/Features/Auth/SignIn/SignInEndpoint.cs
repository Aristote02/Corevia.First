using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Auth.SignIn;

public sealed class SignInEndpoint : Endpoint<SignInRequest, AuthResponse>
{
    private readonly IAuthService _auth;

    public SignInEndpoint(IAuthService auth) => _auth = auth;

    public override void Configure()
    {
        Post("/api/auth/sign-in");
        AllowAnonymous();
    }

    public override async Task HandleAsync(SignInRequest req, CancellationToken ct)
    {
        var result = await _auth.SignInAsync(req, ct);
        if (result is null)
        {
            await Send.UnauthorizedAsync(ct);
            return;
        }

        await Send.OkAsync(result, ct);
    }
}
