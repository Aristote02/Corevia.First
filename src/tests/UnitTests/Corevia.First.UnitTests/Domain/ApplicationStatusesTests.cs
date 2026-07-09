using Corevia.First.Domain.Constants;

namespace Corevia.First.UnitTests.Domain;

public sealed class ApplicationStatusesTests
{
    [Theory]
    [InlineData(ApplicationStatuses.Admin.Nouveau, ApplicationStatuses.User.Nouveau)]
    [InlineData(ApplicationStatuses.Admin.ArriveFinalise, ApplicationStatuses.User.Cloture)]
    [InlineData(ApplicationStatuses.Admin.PasDeReponse, ApplicationStatuses.User.EnCours)]
    [InlineData(ApplicationStatuses.Admin.Invitation, ApplicationStatuses.User.EnCours)]
    public void SyncUserStatusFromAdmin_maps_admin_status_to_user_status(string adminStatus, string expected)
    {
        // Act
        var result = ApplicationStatuses.SyncUserStatusFromAdmin(adminStatus);

        // Assert
        result.Should().Be(expected);
    }
}
