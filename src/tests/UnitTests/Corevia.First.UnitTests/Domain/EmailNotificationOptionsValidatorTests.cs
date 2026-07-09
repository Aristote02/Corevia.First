using Corevia.First.Domain.Constants;
using Corevia.First.Domain.Options;
using Corevia.First.Domain.Options.Validators;
using Microsoft.Extensions.Options;

namespace Corevia.First.UnitTests.Domain;

public sealed class EmailNotificationOptionsValidatorTests : UnitTestBase
{
    private readonly EmailNotificationOptionsValidator _sut = new();

    [Fact]
    public void Validate_when_disabled_returns_success()
    {
        // Arrange
        var options = Fixture.Build<EmailNotificationOptions>()
            .With(x => x.Enabled, false)
            .Create();

        // Act
        var result = _sut.Validate(Options.DefaultName, options);

        // Assert
        result.Succeeded.Should().BeTrue();
    }

    [Fact]
    public void Validate_when_enabled_with_all_required_fields_returns_success()
    {
        // Arrange
        var options = CreateValidEnabledOptions();

        // Act
        var result = _sut.Validate(Options.DefaultName, options);

        // Assert
        result.Succeeded.Should().BeTrue();
    }

    [Fact]
    public void Validate_when_enabled_without_sendgrid_key_returns_failure()
    {
        // Arrange
        var options = CreateValidEnabledOptions() with { SendGridApiKey = string.Empty };

        // Act
        var result = _sut.Validate(Options.DefaultName, options);

        // Assert
        result.Failed.Should().BeTrue();
        result.Failures.Should().Contain(f => f.Contains(nameof(EmailNotificationOptions.SendGridApiKey)));
    }

    private EmailNotificationOptions CreateValidEnabledOptions() =>
        Fixture.Build<EmailNotificationOptions>()
            .With(x => x.Enabled, true)
            .With(x => x.SendGridApiKey, "sg-test-key")
            .With(x => x.SenderEmail, "noreply@corevia.first")
            .With(x => x.SenderName, EmailDefaults.SenderName)
            .With(x => x.FrontendBaseUrl, "https://corevia.first")
            .With(x => x.ResetPasswordPath, EmailDefaults.ResetPasswordPath)
            .With(x => x.PasswordResetSubject, EmailDefaults.PasswordResetSubject)
            .With(x => x.PasswordChangedSubject, EmailDefaults.PasswordChangedSubject)
            .With(x => x.WelcomeSubject, EmailDefaults.WelcomeSubject)
            .Create();
}
