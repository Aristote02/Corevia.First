using Corevia.First.Domain.Options;
using Corevia.First.Domain.Options.Validators;
using Microsoft.Extensions.Options;

namespace Corevia.First.UnitTests.Domain;

public sealed class SupabaseOptionsValidatorTests : UnitTestBase
{
    private readonly SupabaseOptionsValidator _sut = new();

    [Fact]
    public void Validate_when_disabled_returns_success()
    {
        // Arrange
        var options = Fixture.Build<SupabaseOptions>()
            .With(x => x.Enabled, false)
            .With(x => x.ProjectUrl, string.Empty)
            .With(x => x.AnonKey, string.Empty)
            .Create();

        // Act
        var result = _sut.Validate(Options.DefaultName, options);

        // Assert
        result.Succeeded.Should().BeTrue();
    }

    [Fact]
    public void Validate_when_enabled_without_credentials_returns_failure()
    {
        // Arrange
        var options = Fixture.Build<SupabaseOptions>()
            .With(x => x.Enabled, true)
            .With(x => x.ProjectUrl, string.Empty)
            .With(x => x.AnonKey, string.Empty)
            .Create();

        // Act
        var result = _sut.Validate(Options.DefaultName, options);

        // Assert
        result.Failed.Should().BeTrue();
        result.Failures.Should().Contain(f => f.Contains(nameof(SupabaseOptions.ProjectUrl)));
        result.Failures.Should().Contain(f => f.Contains(nameof(SupabaseOptions.AnonKey)));
    }

    [Fact]
    public void Validate_when_enabled_with_credentials_returns_success()
    {
        // Arrange
        var options = Fixture.Build<SupabaseOptions>()
            .With(x => x.Enabled, true)
            .With(x => x.ProjectUrl, "https://example.supabase.co")
            .With(x => x.AnonKey, "anon-key")
            .Create();

        // Act
        var result = _sut.Validate(Options.DefaultName, options);

        // Assert
        result.Succeeded.Should().BeTrue();
    }
}
