using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Admin.GetUsers;

public sealed class GetUsersEndpoint : EndpointWithoutRequest<IReadOnlyList<AdminUserDto>>
{
    private readonly IAdminUserService _adminUsers;

    public GetUsersEndpoint(IAdminUserService adminUsers) => _adminUsers = adminUsers;

    public override void Configure()
    {
        Get("/api/admin/users");
        Policies("Admin");
    }

    public override async Task HandleAsync(CancellationToken ct) =>
        await Send.OkAsync(await _adminUsers.ListUsersAsync(ct), ct);
}
