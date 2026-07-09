using System.Threading;
using Corevia.First.Application.Dtos;
using Corevia.First.Domain.Entities;
using Corevia.First.Domain.Enums;
using Mapster;

namespace Corevia.First.Application.Mapping;

/// <summary>Central Mapster rules for domain entities to application DTOs.</summary>
public sealed class CoreviaFirstMappingRegister : IRegister
{
    private static int _applied;

    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<User, UserProfileDto>()
            .Map(dest => dest.Role, src => src.Role == UserRole.Admin ? "admin" : "client");

        config.NewConfig<User, AdminUserDto>()
            .Map(dest => dest.Role, src => src.Role == UserRole.Admin ? "admin" : "client");
    }

    /// <summary>Registers mappings on the global config (idempotent for repeated host setup).</summary>
    public static void ApplyGlobal()
    {
        if (Interlocked.Exchange(ref _applied, 1) != 0)
            return;

        new CoreviaFirstMappingRegister().Register(TypeAdapterConfig.GlobalSettings);
    }
}
