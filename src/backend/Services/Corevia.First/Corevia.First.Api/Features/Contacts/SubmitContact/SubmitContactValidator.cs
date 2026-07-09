using Corevia.First.Application.Dtos;
using FastEndpoints;
using FluentValidation;

namespace Corevia.First.Api.Features.Contacts.SubmitContact;

public sealed class SubmitContactValidator : Validator<SubmitContactRequest>
{
    public SubmitContactValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MinimumLength(2).MaximumLength(200);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Message).NotEmpty().MaximumLength(5000);
        RuleFor(x => x.Phone).MaximumLength(32);
        RuleFor(x => x.Country).MaximumLength(100);
    }
}
