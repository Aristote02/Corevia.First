using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Mapping;
using Corevia.First.Application.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Corevia.First.Application.DI;

public static class ApplicationDependencies
{
    public static IServiceCollection ConfigureApplication(this IServiceCollection services, IConfiguration configuration)
    {
        _ = configuration;

        CoreviaFirstMappingRegister.ApplyGlobal();

        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IApplicationService, ApplicationService>();
        services.AddScoped<IContactService, ContactService>();
        services.AddScoped<ITestimonialService, TestimonialService>();
        services.AddScoped<ICatalogService, CatalogService>();
        services.AddScoped<IAdminUserService, AdminUserService>();

        return services;
    }
}
