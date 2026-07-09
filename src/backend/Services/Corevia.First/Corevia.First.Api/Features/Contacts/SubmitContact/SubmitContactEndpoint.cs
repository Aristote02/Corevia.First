using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Contacts.SubmitContact;

public sealed class SubmitContactEndpoint : Endpoint<SubmitContactRequest, ContactDto>
{
    private readonly IContactService _contacts;

    public SubmitContactEndpoint(IContactService contacts) => _contacts = contacts;

    public override void Configure()
    {
        Post("/api/contacts/submit");
        AllowAnonymous();
    }

    public override async Task HandleAsync(SubmitContactRequest req, CancellationToken ct)
    {
        var result = await _contacts.SubmitAsync(req, ct);
        await Send.OkAsync(result, ct);
    }
}
