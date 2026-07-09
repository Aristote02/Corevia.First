using Corevia.First.Application.Abstractions.Repositories;
using Corevia.First.Application.Dtos;
using Corevia.First.Application.Services;
using Corevia.First.Domain.Constants;
using Corevia.First.Domain.Entities;
using ApplicationEntity = Corevia.First.Domain.Entities.Application;

namespace Corevia.First.UnitTests.Application.Services;

public sealed class ApplicationServiceTests : UnitTestBase
{
    private readonly IRepository<ApplicationEntity> _applications = Substitute.For<IRepository<ApplicationEntity>>();
    private readonly IRepository<ApplicationHistory> _history = Substitute.For<IRepository<ApplicationHistory>>();
    private readonly IUserRepository _users = Substitute.For<IUserRepository>();
    private readonly IRepository<Contact> _contacts = Substitute.For<IRepository<Contact>>();
    private readonly ApplicationService _sut;

    public ApplicationServiceTests() =>
        _sut = new ApplicationService(_applications, _history, _users, _contacts);

    [Fact]
    public async Task SubmitAsync_assigns_first_application_number_when_none_exist()
    {
        // Arrange
        var request = Fixture.Build<SubmitApplicationRequest>()
            .With(x => x.FullName, "  Jamal Raw  ")
            .With(x => x.Email, "  Test@Example.COM  ")
            .With(x => x.Country, " France ")
            .With(x => x.Service, " Visa ")
            .With(x => x.Message, " Help ")
            .Create();

        _applications.ReturnsQueryable(Array.Empty<ApplicationEntity>());
        _applications.ReturnsPersistedAdd();

        // Act
        var result = await _sut.SubmitAsync(request);

        // Assert
        result.ApplicationNumber.Should().Be("APP00001");
        result.Email.Should().Be("test@example.com");
        result.Status.Should().Be(ApplicationStatuses.User.Nouveau);
        result.AdminStatus.Should().Be(ApplicationStatuses.Admin.Nouveau);
    }

    [Fact]
    public async Task SubmitAsync_increments_existing_application_number()
    {
        // Arrange
        var request = Fixture.Create<SubmitApplicationRequest>();
        var existing = Fixture.Build<ApplicationEntity>()
            .With(x => x.ApplicationNumber, "APP00009")
            .Create();

        _applications.ReturnsQueryable([existing]);
        _applications.ReturnsPersistedAdd();

        // Act
        var result = await _sut.SubmitAsync(request);

        // Assert
        result.ApplicationNumber.Should().Be("APP00010");
    }

    [Fact]
    public async Task UpdateAdminStatusAsync_syncs_user_status_and_writes_history()
    {
        // Arrange
        var application = Fixture.Build<ApplicationEntity>()
            .With(x => x.AdminStatus, ApplicationStatuses.Admin.Nouveau)
            .With(x => x.Status, ApplicationStatuses.User.Nouveau)
            .Create();
        var adminId = Guid.NewGuid();

        _applications.ReturnsGetByPredicate([application]);
        _applications.ReturnsPersistedAdd();
        _history.ReturnsPersistedAdd();

        // Act
        var result = await _sut.UpdateAdminStatusAsync(
            application.Id,
            adminId,
            ApplicationStatuses.Admin.Invitation,
            "Approved for next step");

        // Assert
        result.Should().NotBeNull();
        result!.AdminStatus.Should().Be(ApplicationStatuses.Admin.Invitation);
        result.Status.Should().Be(ApplicationStatuses.User.EnCours);

        await _history.Received(1).AddAsync(
            Arg.Is<ApplicationHistory>(h =>
                h.ApplicationId == application.Id &&
                h.OldStatus == ApplicationStatuses.Admin.Nouveau &&
                h.NewStatus == ApplicationStatuses.Admin.Invitation &&
                h.ChangedBy == adminId),
            Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task GetOverviewStatsAsync_returns_user_and_contact_totals()
    {
        // Arrange
        var apps = new[]
        {
            Fixture.Build<ApplicationEntity>().With(x => x.Status, ApplicationStatuses.User.Nouveau).Create(),
            Fixture.Build<ApplicationEntity>().With(x => x.Status, ApplicationStatuses.User.EnCours).Create(),
            Fixture.Build<ApplicationEntity>().With(x => x.Status, ApplicationStatuses.User.Cloture).Create(),
        };

        _applications.ReturnsQueryable(apps);
        _users.ReturnsCount(Fixture.CreateMany<User>(4));
        _contacts.ReturnsCount(Fixture.CreateMany<Contact>(6));

        // Act
        var stats = await _sut.GetOverviewStatsAsync();

        // Assert
        stats.TotalApplications.Should().Be(3);
        stats.NewApplications.Should().Be(1);
        stats.InProgressApplications.Should().Be(1);
        stats.ClosedApplications.Should().Be(1);
        stats.TotalUsers.Should().Be(4);
        stats.TotalContacts.Should().Be(6);
        stats.RecentApplications.Should().HaveCount(3);
    }

    [Fact]
    public async Task DeleteAsync_when_application_missing_returns_false()
    {
        // Arrange
        _applications.ReturnsGetByPredicate(Array.Empty<ApplicationEntity>());

        // Act
        var result = await _sut.DeleteAsync(Guid.NewGuid());

        // Assert
        result.Should().BeFalse();
    }
}
