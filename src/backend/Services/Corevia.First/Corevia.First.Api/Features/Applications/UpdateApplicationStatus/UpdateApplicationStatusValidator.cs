using FastEndpoints;
using FluentValidation;

namespace Corevia.First.Api.Features.Applications.UpdateApplicationStatus;

public sealed class UpdateApplicationStatusValidator : Validator<UpdateApplicationStatusRequest>
{
    public UpdateApplicationStatusValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.AdminStatus).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Notes).MaximumLength(5000);
    }
}
