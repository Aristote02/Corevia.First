using Corevia.First.Application.Dtos;
using Corevia.First.Domain.Entities;
using Mapster;
using ApplicationEntity = Corevia.First.Domain.Entities.Application;

namespace Corevia.First.Application.Mapping;

public static class EntityMappingExtensions
{
    public static ApplicationDto ToDto(this ApplicationEntity application) =>
        application.Adapt<ApplicationDto>();

    public static ApplicationHistoryDto ToDto(this ApplicationHistory history) =>
        history.Adapt<ApplicationHistoryDto>();

    public static ContactDto ToDto(this Contact contact) =>
        contact.Adapt<ContactDto>();

    public static TestimonialDto ToDto(this Testimonial testimonial) =>
        testimonial.Adapt<TestimonialDto>();

    public static UserProfileDto ToProfileDto(this User user) =>
        user.Adapt<UserProfileDto>();

    public static AdminUserDto ToAdminUserDto(this User user, int applicationsCount) =>
        user.Adapt<AdminUserDto>() with { ApplicationsCount = applicationsCount };

    public static AdminOverviewStatsDto ToAdminOverviewStatsDto(
        this IEnumerable<ApplicationEntity> recentApplications,
        int totalApplications,
        int newApplications,
        int inProgressApplications,
        int closedApplications,
        int totalUsers,
        int totalContacts) =>
        new(
            totalApplications,
            newApplications,
            inProgressApplications,
            closedApplications,
            totalUsers,
            totalContacts,
            recentApplications.Adapt<List<ApplicationDto>>());

    public static PagedResponse<TDto> ToPagedResponse<TEntity, TDto>(
        this IEnumerable<TEntity> items,
        int page,
        int pageSize,
        int totalCount) =>
        new(items.Adapt<List<TDto>>(), page, pageSize, totalCount);
}
