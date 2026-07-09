using Corevia.First.Application.Dtos;
using FastEndpoints;
using FluentValidation;

namespace Corevia.First.Api.Features.Admin.UpdateUser;

public sealed class UpdateUserValidator : Validator<UpdateAdminUserRequest>
{
    public UpdateUserValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.FullName).NotEmpty().MinimumLength(2).MaximumLength(200);
        RuleFor(x => x.Role).MaximumLength(50);
    }
}
