using Corevia.First.Api.Authorization;
using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Admin.UpdateUser;

public sealed class UpdateUserEndpoint : Endpoint<UpdateAdminUserRequest>
{
    private readonly IAdminUserService _adminUsers;

    public UpdateUserEndpoint(IAdminUserService adminUsers) => _adminUsers = adminUsers;

    public override void Configure()
    {
        Post("/api/admin/users/update");
        Policies("SuperAdmin");
    }

    public override async Task HandleAsync(UpdateAdminUserRequest req, CancellationToken ct)
    {
        var result = await _adminUsers.UpdateUserAsync(User.GetUserId(), req, ct);
        if (result is null)
        {
            await Send.ResultAsync(Results.Json(new { success = false, error = "Forbidden or user not found." }, statusCode: StatusCodes.Status403Forbidden));
            return;
        }

        await Send.OkAsync(new { success = true, user = result }, ct);
    }
}
