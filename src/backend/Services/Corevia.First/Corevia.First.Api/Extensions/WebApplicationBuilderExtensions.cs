using Corevia.First.Api;
using Corevia.First.Api.Configuration;
using Corevia.First.Application.Auth;
using Corevia.First.Application.DI;
using Corevia.First.Domain.Options;
using Corevia.First.Domain.Options.Validators;
using Corevia.First.Infrastructure;
using Corevia.First.Infrastructure.Data;
using Corevia.First.ServiceDefaults;
using FastEndpoints;
using FluentValidation;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Options;

namespace Corevia.First.Api.Extensions;

public static class WebApplicationBuilderExtensions
{
    /// <summary>
    /// Registers Corevia First API services, data access, infrastructure, and validation.
    /// </summary>
    public static WebApplicationBuilder AddCoreviaFirst(this WebApplicationBuilder builder)
    {
        var services = builder.Services;
        var configuration = builder.Configuration;

        services.AddOptionsWithBaseValidationOnStart<ConnectionStringsOptions>(configuration, x => x.CoreviaFirstDbConnectionString);
        services.Configure<AuthOptions>(configuration.GetSection(AuthOptions.SectionName));
        services.AddOptions<EmailNotificationOptions>()
            .Bind(configuration.GetSection(EmailNotificationOptions.SectionName))
            .ValidateOnStart();
        services.AddSingleton<IValidateOptions<EmailNotificationOptions>, EmailNotificationOptionsValidator>();
        services.AddOptions<SupabaseOptions>()
            .Bind(configuration.GetSection(SupabaseOptions.SectionName))
            .ValidateOnStart();
        services.AddSingleton<IValidateOptions<SupabaseOptions>, SupabaseOptionsValidator>();

        _ = configuration.GetSection(ConnectionStringsOptions.SectionName).Get<ConnectionStringsOptions>()
            ?? throw new InvalidOperationException("Connection strings options are not configured.");

        builder.AddServiceDefaults();

        services.AddLocalization(options => options.ResourcesPath = "Resources");

        builder.AddDatabase<CoreviaFirstDbContext, ConnectionStringsOptions>(
            x => x.CoreviaFirstDbConnectionString,
            "Corevia.First.Infrastructure");

        services.ConfigureRepositories(configuration);
        services.ConfigureCache(configuration);
        services.AddInfrastructure(configuration);
        services.ConfigureApplication(configuration);

        services.AddValidatorsFromAssembly(typeof(AssemblyMarker).Assembly);

        services
            .AddCoreviaFirstCors(configuration, builder.Environment)
            .AddCoreviaFirstJwtBearer(configuration)
            .AddEndpointsApiExplorer()
            .AddFastEndpoints()
            .ConfigureSwagger(configuration)
            .AddHttpContextAccessor();

        services.AddProblemDetails();
        services.AddExceptionHandler<GlobalExceptionHandler>();

        services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            options.KnownIPNetworks.Clear();
            options.KnownProxies.Clear();
            options.ForwardLimit = null;
        });

        services.AddAuthorizationBuilder()
            .AddPolicy("Admin", policy => policy.RequireClaim("role", "admin"))
            .AddPolicy("SuperAdmin", policy => policy.RequireClaim(AuthClaims.IsSuperAdmin, "true"));

        services.AddHostedService<Hosting.AdminSeedHostedService>();

        return builder;
    }
}
