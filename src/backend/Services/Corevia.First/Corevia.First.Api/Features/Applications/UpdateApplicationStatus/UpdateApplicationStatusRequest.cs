namespace Corevia.First.Api.Features.Applications.UpdateApplicationStatus;

public sealed record UpdateApplicationStatusRequest(Guid Id, string AdminStatus, string? Notes);
