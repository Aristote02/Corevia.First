using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Contacts.ListContactsAdmin;

public sealed class ListContactsAdminEndpoint : Endpoint<ListContactsAdminRequest, PagedResponse<ContactDto>>
{
    private readonly IContactService _contacts;

    public ListContactsAdminEndpoint(IContactService contacts) => _contacts = contacts;

    public override void Configure()
    {
        Get("/api/admin/contacts");
        Policies("Admin");
    }

    public override async Task HandleAsync(ListContactsAdminRequest req, CancellationToken ct)
    {
        var result = await _contacts.ListAsync(req.Page, req.PageSize, ct);
        await Send.OkAsync(result, ct);
    }
}
