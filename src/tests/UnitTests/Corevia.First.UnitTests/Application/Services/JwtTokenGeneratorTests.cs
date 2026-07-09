using System.IdentityModel.Tokens.Jwt;
using Corevia.First.Application.Auth;
using Corevia.First.Application.Configuration;
using Corevia.First.Application.Services;
using Corevia.First.Domain.Entities;
using Corevia.First.Domain.Enums;
using Microsoft.Extensions.Options;

namespace Corevia.First.UnitTests.Application.Services;

public sealed class JwtTokenGeneratorTests : UnitTestBase
{
    [Fact]
    public void CreateAccessToken_includes_core_claims_for_client_user()
    {
        // Arrange
        var user = Fixture.Build<User>()
            .With(x => x.Role, UserRole.Client)
            .With(x => x.IsSuperAdmin, false)
            .Create();

        var options = Options.Create(CreateJwtOptions());
        var sut = new JwtTokenGenerator(options);

        // Act
        var (token, expiresAt, jti) = sut.CreateAccessToken(user);

        // Assert
        token.Should().NotBeNullOrWhiteSpace();
        jti.Should().NotBeNullOrWhiteSpace();
        expiresAt.Should().BeAfter(DateTimeOffset.UtcNow);

        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
        jwt.Issuer.Should().Be("corevia-first-test");
        jwt.Audiences.Should().Contain("corevia-first-test");
        jwt.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.Sub && c.Value == user.Id.ToString());
        jwt.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.Email && c.Value == user.Email);
        jwt.Claims.Should().Contain(c => c.Type == "role" && c.Value == "client");
        jwt.Claims.Should().NotContain(c => c.Type == AuthClaims.IsSuperAdmin);
    }

    [Fact]
    public void CreateAccessToken_adds_super_admin_claim_when_required()
    {
        // Arrange
        var user = Fixture.Build<User>()
            .With(x => x.Role, UserRole.Admin)
            .With(x => x.IsSuperAdmin, true)
            .Create();

        var sut = new JwtTokenGenerator(Options.Create(CreateJwtOptions()));

        // Act
        var (token, _, _) = sut.CreateAccessToken(user);

        // Assert
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
        jwt.Claims.Should().Contain(c => c.Type == AuthClaims.IsSuperAdmin && c.Value == "true");
        jwt.Claims.Should().Contain(c => c.Type == "role" && c.Value == "admin");
    }

    private static JwtOptions CreateJwtOptions() =>
        new()
        {
            Key = new string('a', 64),
            Issuer = "corevia-first-test",
            Audience = "corevia-first-test",
            AccessTokenMinutes = 30,
            RefreshTokenDays = 7,
        };
}
