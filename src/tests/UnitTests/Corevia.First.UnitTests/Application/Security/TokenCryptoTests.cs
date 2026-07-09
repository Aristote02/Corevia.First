using Corevia.First.Application.Security;

namespace Corevia.First.UnitTests.Application.Security;

public sealed class TokenCryptoTests
{
    [Fact]
    public void Hash_returns_deterministic_lowercase_hex()
    {
        // Arrange
        const string value = "reset-token-123";

        // Act
        var first = TokenCrypto.Hash(value);
        var second = TokenCrypto.Hash(value);

        // Assert
        first.Should().Be(second);
        first.Should().HaveLength(64);
        first.Should().MatchRegex("^[0-9a-f]+$");
    }

    [Fact]
    public void GenerateOpaqueToken_returns_unique_non_empty_values()
    {
        // Act
        var first = TokenCrypto.GenerateOpaqueToken();
        var second = TokenCrypto.GenerateOpaqueToken();

        // Assert
        first.Should().NotBeNullOrWhiteSpace();
        second.Should().NotBeNullOrWhiteSpace();
        first.Should().NotBe(second);
    }
}
