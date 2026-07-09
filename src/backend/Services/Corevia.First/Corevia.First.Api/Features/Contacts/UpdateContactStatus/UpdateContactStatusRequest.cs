namespace Corevia.First.Api.Features.Contacts.UpdateContactStatus;

public sealed record UpdateContactStatusRequest(Guid Id, string Status);
