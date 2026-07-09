using Corevia.First.Application.Mapping;
using Corevia.First.Domain.Entities;
using Corevia.First.Domain.Enums;
using ApplicationEntity = Corevia.First.Domain.Entities.Application;

namespace Corevia.First.UnitTests.Application.Mapping;

public sealed class EntityMappingTests : UnitTestBase
{
    [Theory]
    [InlineData(UserRole.Admin, "admin")]
    [InlineData(UserRole.Client, "client")]
    public void User_maps_role_to_api_string(UserRole role, string expectedRole)
    {
        // Arrange
        var user = Fixture.Build<User>()
            .With(x => x.Role, role)
            .Create();

        // Act
        var profile = user.ToProfileDto();
        var adminUser = user.ToAdminUserDto(applicationsCount: 3);

        // Assert
        profile.Role.Should().Be(expectedRole);
        adminUser.Role.Should().Be(expectedRole);
        adminUser.ApplicationsCount.Should().Be(3);
    }

    [Fact]
    public void Application_maps_to_dto_with_matching_fields()
    {
        // Arrange
        var application = Fixture.Build<ApplicationEntity>()
            .With(x => x.ApplicationNumber, "APP00042")
            .Create();

        // Act
        var dto = application.ToDto();

        // Assert
        dto.Id.Should().Be(application.Id);
        dto.ApplicationNumber.Should().Be("APP00042");
        dto.Email.Should().Be(application.Email);
        dto.Status.Should().Be(application.Status);
    }

    [Fact]
    public void Contact_maps_to_dto_with_matching_fields()
    {
        // Arrange
        var contact = Fixture.Create<Contact>();

        // Act
        var dto = contact.ToDto();

        // Assert
        dto.Id.Should().Be(contact.Id);
        dto.Name.Should().Be(contact.Name);
        dto.Email.Should().Be(contact.Email);
        dto.Status.Should().Be(contact.Status);
    }

    [Fact]
    public void ToAdminOverviewStatsDto_builds_aggregate_with_recent_applications()
    {
        // Arrange
        var recent = Fixture.CreateMany<ApplicationEntity>(2).ToList();

        // Act
        var stats = recent.ToAdminOverviewStatsDto(10, 4, 3, 2, 7, 5);

        // Assert
        stats.TotalApplications.Should().Be(10);
        stats.TotalUsers.Should().Be(7);
        stats.TotalContacts.Should().Be(5);
        stats.RecentApplications.Should().HaveCount(2);
    }
}
