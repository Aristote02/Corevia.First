using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Auth.SignUp;

public sealed class SignUpEndpoint : Endpoint<SignUpRequest, AuthResponse>
{
    private readonly IAuthService _auth;

    public SignUpEndpoint(IAuthService auth) => _auth = auth;

    public override void Configure()
    {
        Post("/api/auth/sign-up");
        AllowAnonymous();
    }

    public override async Task HandleAsync(SignUpRequest req, CancellationToken ct)
    {
        var result = await _auth.SignUpAsync(req, ct);
        if (result is null)
        {
            await Send.ResultAsync(Results.Conflict(new { error = "Email already registered." }));
            return;
        }

        await Send.OkAsync(result, ct);
    }
}
