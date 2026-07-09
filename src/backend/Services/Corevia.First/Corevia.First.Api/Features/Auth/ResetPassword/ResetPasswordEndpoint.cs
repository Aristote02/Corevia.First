using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;
using FluentValidation;

namespace Corevia.First.Api.Features.Auth.ResetPassword;

public sealed class ResetPasswordEndpoint : Endpoint<ResetPasswordRequest>
{
    private readonly IAuthService _auth;

    public ResetPasswordEndpoint(IAuthService auth) => _auth = auth;

    public override void Configure()
    {
        Post("/api/auth/reset-password");
        AllowAnonymous();
    }

    public override async Task HandleAsync(ResetPasswordRequest req, CancellationToken ct)
    {
        var ok = await _auth.ResetPasswordAsync(req, ct);
        if (!ok)
        {
            await Send.ResultAsync(Results.Json(
                new { error = "Invalid or expired reset request." },
                statusCode: StatusCodes.Status400BadRequest));
            return;
        }

        await Send.NoContentAsync(ct);
    }
}

public sealed class ResetPasswordValidator : Validator<ResetPasswordRequest>
{
    public ResetPasswordValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Token).NotEmpty();
        RuleFor(x => x.NewPassword).NotEmpty().MinimumLength(6);
    }
}
