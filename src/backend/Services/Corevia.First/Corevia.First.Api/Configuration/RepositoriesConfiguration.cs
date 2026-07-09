using Corevia.First.Application.Abstractions.Repositories;
using Corevia.First.Domain.Entities;
using Corevia.First.Infrastructure.Data.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ApplicationEntity = Corevia.First.Domain.Entities.Application;

namespace Corevia.First.Api.Configuration;

public static class RepositoriesConfiguration
{
    public static IServiceCollection ConfigureRepositories(this IServiceCollection services, IConfiguration configuration)
    {
        _ = configuration;

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IRepository<ApplicationEntity>, Repository<ApplicationEntity>>();
        services.AddScoped<IRepository<ApplicationHistory>, Repository<ApplicationHistory>>();
        services.AddScoped<IRepository<Contact>, Repository<Contact>>();
        services.AddScoped<IRepository<Testimonial>, Repository<Testimonial>>();
        services.AddScoped<IRepository<Destination>, Repository<Destination>>();
        services.AddScoped<IRepository<AgencyService>, Repository<AgencyService>>();
        services.AddScoped<IRepository<Faq>, Repository<Faq>>();
        services.AddScoped<IRepository<VisaPackage>, Repository<VisaPackage>>();
        services.AddScoped<IRepository<Statistic>, Repository<Statistic>>();
        services.AddScoped<IRepository<GalleryUniversity>, Repository<GalleryUniversity>>();

        return services;
    }
}
