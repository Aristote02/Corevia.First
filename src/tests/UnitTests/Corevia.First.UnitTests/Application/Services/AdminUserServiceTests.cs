using Corevia.First.Application.Abstractions.Repositories;
using Corevia.First.Application.Dtos;
using Corevia.First.Application.Services;
using Corevia.First.Domain.Entities;
using Corevia.First.Domain.Enums;
using ApplicationEntity = Corevia.First.Domain.Entities.Application;

namespace Corevia.First.UnitTests.Application.Services;

public sealed class AdminUserServiceTests : UnitTestBase
{
    private readonly IUserRepository _users = Substitute.For<IUserRepository>();
    private readonly IRepository<ApplicationEntity> _applications = Substitute.For<IRepository<ApplicationEntity>>();
    private readonly AdminUserService _sut;

    public AdminUserServiceTests() => _sut = new AdminUserService(_users, _applications);

    [Fact]
    public async Task ListUsersAsync_maps_application_counts_per_user()
    {
        // Arrange
        var user = Fixture.Build<User>().With(x => x.Role, UserRole.Client).Create();
        var application = Fixture.Build<ApplicationEntity>().With(x => x.UserId, user.Id).Create();

        _users.GetAllCreatedDescAsync(Arg.Any<CancellationToken>()).Returns([user]);
        _applications.ReturnsQueryable([application, application]);

        // Act
        var result = await _sut.ListUsersAsync();

        // Assert
        result.Should().ContainSingle();
        result[0].ApplicationsCount.Should().Be(2);
        result[0].Role.Should().Be("client");
    }

    [Fact]
    public async Task UpdateUserAsync_when_caller_is_not_super_admin_returns_null()
    {
        // Arrange
        var caller = Fixture.Build<User>().With(x => x.IsSuperAdmin, false).Create();
        var request = Fixture.Create<UpdateAdminUserRequest>();

        _users.GetByIdTrackedAsync(caller.Id, Arg.Any<CancellationToken>()).Returns(caller);

        // Act
        var result = await _sut.UpdateUserAsync(caller.Id, request);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task UpdateUserAsync_when_super_admin_updates_target_user()
    {
        // Arrange
        var callerId = Guid.NewGuid();
        var targetId = Guid.NewGuid();
        var caller = Fixture.Build<User>().With(x => x.Id, callerId).With(x => x.IsSuperAdmin, true).Create();
        var target = Fixture.Build<User>()
            .With(x => x.Id, targetId)
            .With(x => x.Role, UserRole.Client)
            .Create();

        var request = new UpdateAdminUserRequest(targetId, "  Updated Name  ", false, "admin");

        _users.GetByIdTrackedAsync(callerId, Arg.Any<CancellationToken>()).Returns(caller);
        _users.GetByIdTrackedAsync(targetId, Arg.Any<CancellationToken>()).Returns(target);
        _users.SaveChangesAsync(Arg.Any<CancellationToken>()).Returns(1);
        _applications.ReturnsCount([]);

        // Act
        var result = await _sut.UpdateUserAsync(callerId, request);

        // Assert
        result.Should().NotBeNull();
        result!.FullName.Should().Be("Updated Name");
        result.Role.Should().Be("admin");
        target.FullName.Should().Be("Updated Name");
        target.Role.Should().Be(UserRole.Admin);
    }

    [Fact]
    public async Task DeleteUserAsync_when_target_is_super_admin_returns_false()
    {
        // Arrange
        var callerId = Guid.NewGuid();
        var targetId = Guid.NewGuid();
        var caller = Fixture.Build<User>().With(x => x.Id, callerId).With(x => x.IsSuperAdmin, true).Create();
        var target = Fixture.Build<User>().With(x => x.Id, targetId).With(x => x.IsSuperAdmin, true).Create();

        _users.GetByIdTrackedAsync(callerId, Arg.Any<CancellationToken>()).Returns(caller);
        _users.GetByIdTrackedAsync(targetId, Arg.Any<CancellationToken>()).Returns(target);

        // Act
        var result = await _sut.DeleteUserAsync(callerId, targetId);

        // Assert
        result.Should().BeFalse();
        await _users.DidNotReceive().DeleteAsync(Arg.Any<User>(), Arg.Any<CancellationToken>());
    }
}
