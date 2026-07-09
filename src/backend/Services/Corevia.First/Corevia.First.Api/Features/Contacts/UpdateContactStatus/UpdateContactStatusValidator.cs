using FastEndpoints;
using FluentValidation;

namespace Corevia.First.Api.Features.Contacts.UpdateContactStatus;

public sealed class UpdateContactStatusValidator : Validator<UpdateContactStatusRequest>
{
    public UpdateContactStatusValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Status).NotEmpty().MaximumLength(50);
    }
}
