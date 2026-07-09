using Corevia.First.Application.Dtos;
using FastEndpoints;
using FluentValidation;

namespace Corevia.First.Api.Features.Auth.SignUp;

public sealed class SignUpValidator : Validator<SignUpRequest>
{
    public SignUpValidator()
    {
        RuleFor(x => x.FullName).NotEmpty().MinimumLength(2).MaximumLength(200);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
    }
}
