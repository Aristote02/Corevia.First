using Corevia.First.Application.Dtos;
using FastEndpoints;
using FluentValidation;

namespace Corevia.First.Api.Features.Applications.SubmitApplication;

public sealed class SubmitApplicationValidator : Validator<SubmitApplicationRequest>
{
    public SubmitApplicationValidator()
    {
        RuleFor(x => x.FullName).NotEmpty().MinimumLength(2).MaximumLength(200);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Country).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Service).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Message).NotEmpty().MaximumLength(5000);
        RuleFor(x => x.Phone).MaximumLength(32);
    }
}
