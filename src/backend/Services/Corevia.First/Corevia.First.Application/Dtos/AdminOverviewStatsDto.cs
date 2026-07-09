namespace Corevia.First.Application.Dtos;

public record AdminOverviewStatsDto(
    int TotalApplications,
    int NewApplications,
    int InProgressApplications,
    int ClosedApplications,
    int TotalUsers,
    int TotalContacts,
    IReadOnlyList<ApplicationDto> RecentApplications);
