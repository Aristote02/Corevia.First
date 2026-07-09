using Corevia.First.Api.Authorization;
using Corevia.First.Application.Abstractions.Services;
using FastEndpoints;

namespace Corevia.First.Api.Features.Admin.DeleteUser;

public sealed class DeleteUserEndpoint : Endpoint<DeleteUserRequest>
{
    private readonly IAdminUserService _adminUsers;

    public DeleteUserEndpoint(IAdminUserService adminUsers) => _adminUsers = adminUsers;

    public override void Configure()
    {
        Delete("/api/admin/users/{UserId}");
        Policies("SuperAdmin");
    }

    public override async Task HandleAsync(DeleteUserRequest req, CancellationToken ct)
    {
        var deleted = await _adminUsers.DeleteUserAsync(User.GetUserId(), req.UserId, ct);
        if (!deleted)
        {
            await Send.ResultAsync(Results.Json(new { success = false, error = "Forbidden or user not found." }, statusCode: StatusCodes.Status403Forbidden));
            return;
        }

        await Send.OkAsync(new { success = true }, ct);
    }
}
