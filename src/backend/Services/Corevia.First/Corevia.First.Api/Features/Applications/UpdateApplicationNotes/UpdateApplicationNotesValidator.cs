using FastEndpoints;
using FluentValidation;

namespace Corevia.First.Api.Features.Applications.UpdateApplicationNotes;

public sealed class UpdateApplicationNotesValidator : Validator<UpdateApplicationNotesRequest>
{
    public UpdateApplicationNotesValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.AdminNotes).NotEmpty().MaximumLength(5000);
    }
}
