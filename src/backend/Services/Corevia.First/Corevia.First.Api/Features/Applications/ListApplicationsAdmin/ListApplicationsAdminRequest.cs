namespace Corevia.First.Api.Features.Applications.ListApplicationsAdmin;

public sealed record ListApplicationsAdminRequest(
    int Page = 1,
    int PageSize = 20,
    string? Status = null,
    string? Search = null);
