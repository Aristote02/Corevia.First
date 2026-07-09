using AutoFixture.AutoNSubstitute;
using Corevia.First.Application.Mapping;
using Corevia.First.Domain.Enums;

namespace Corevia.First.UnitTests.Common;

public abstract class UnitTestBase
{
    protected IFixture Fixture { get; } = CreateFixture();

    protected UnitTestBase() => CoreviaFirstMappingRegister.ApplyGlobal();

    private static IFixture CreateFixture()
    {
        var fixture = new Fixture().Customize(new AutoNSubstituteCustomization { ConfigureMembers = true });

        fixture.Behaviors.OfType<ThrowingRecursionBehavior>().ToList()
            .ForEach(behavior => fixture.Behaviors.Remove(behavior));
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        fixture.Customize<UserRole>(composer => composer.FromFactory(() => UserRole.Client));
        fixture.Customize<DateTimeOffset>(composer => composer.FromFactory(() => DateTimeOffset.UtcNow));

        return fixture;
    }
}
