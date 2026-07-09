using Corevia.First.Application.Configuration;
using Corevia.First.Domain.Entities;
using Corevia.First.Domain.Options;
using Corevia.First.Infrastructure.Auth;
using Corevia.First.Infrastructure.Email;
using Corevia.First.Infrastructure.Email.Rendering;
using Corevia.First.Infrastructure.Email.Sending;
using Corevia.First.Infrastructure.Email.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using SendGrid;
using Corevia.First.Application.Abstractions.Services;

namespace Corevia.First.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<CoreviaFirstOptions>(configuration.GetSection(CoreviaFirstOptions.SectionName));
        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));
        services.Configure<AdminSeedOptions>(configuration.GetSection(AdminSeedOptions.SectionName));

        services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();

        services.AddSingleton(sp =>
        {
            var options = sp.GetRequiredService<IOptions<EmailNotificationOptions>>().Value;
            return new SendGridClient(options.SendGridApiKey);
        });
        services.AddSingleton<EmbeddedEmailLogoAttachmentProvider>();
        services.AddSingleton<IEmailHeaderLogoUrlResolver, EmailHeaderLogoUrlResolver>();
        services.AddScoped<IEmailNotificationService, EmailNotificationService>();
        services.AddSingleton<IMustacheTemplateRenderer, EmbeddedMustacheTemplateRenderer>();
        services.AddScoped<IEmailSender, SendGridEmailSender>();

        services.AddScoped<ISupabaseAuthService, SupabaseAuthService>();

        return services;
    }
}
