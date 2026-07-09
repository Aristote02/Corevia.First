using Corevia.First.Application.Abstractions.Services;
using FastEndpoints;

namespace Corevia.First.Api.Features.Contacts.DeleteContact;

public sealed class DeleteContactEndpoint : Endpoint<DeleteContactRequest>
{
    private readonly IContactService _contacts;

    public DeleteContactEndpoint(IContactService contacts) => _contacts = contacts;

    public override void Configure()
    {
        Delete("/api/admin/contacts/{Id}");
        Policies("Admin");
    }

    public override async Task HandleAsync(DeleteContactRequest req, CancellationToken ct)
    {
        var deleted = await _contacts.DeleteAsync(req.Id, ct);
        if (!deleted)
        {
            await Send.NotFoundAsync(ct);
            return;
        }

        await Send.NoContentAsync(ct);
    }
}
