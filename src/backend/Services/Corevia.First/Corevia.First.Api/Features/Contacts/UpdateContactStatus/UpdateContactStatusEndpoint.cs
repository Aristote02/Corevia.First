using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Contacts.UpdateContactStatus;

public sealed class UpdateContactStatusEndpoint : Endpoint<UpdateContactStatusRequest, ContactDto>
{
    private readonly IContactService _contacts;

    public UpdateContactStatusEndpoint(IContactService contacts) => _contacts = contacts;

    public override void Configure()
    {
        Patch("/api/admin/contacts/{Id}/status");
        Policies("Admin");
    }

    public override async Task HandleAsync(UpdateContactStatusRequest req, CancellationToken ct)
    {
        var result = await _contacts.UpdateStatusAsync(req.Id, req.Status, ct);
        if (result is null)
        {
            await Send.NotFoundAsync(ct);
            return;
        }

        await Send.OkAsync(result, ct);
    }
}
