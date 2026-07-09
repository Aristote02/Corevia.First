using Corevia.First.Api.Configuration;
using Corevia.First.Api.Localization;
using Corevia.First.Domain.Options;
using Corevia.First.ServiceDefaults;
using FastEndpoints;
using FastEndpoints.Swagger;
using Microsoft.Extensions.Options;
using NSwag.AspNetCore;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Corevia.First.Api.Extensions;

public static class WebApplicationExtensions
{
    /// <summary>
    /// Localization, Swagger (dev), security headers, CORS, auth, FastEndpoints, and health endpoints.
    /// </summary>
    public static WebApplication UseCoreviaFirst(this WebApplication app)
    {
        app.UseForwardedHeaders();

        var supportedCultures = new[] { "en-US", "fr-FR" };
        var localizationOptions = new RequestLocalizationOptions()
            .SetDefaultCulture(supportedCultures[0])
            .AddSupportedCultures(supportedCultures)
            .AddSupportedUICultures(supportedCultures);

        localizationOptions.RequestCultureProviders.Insert(0, new UserLanguageRequestCultureProvider());
        app.UseRequestLocalization(localizationOptions);

        var authOptions = app.Services.GetRequiredService<IOptions<AuthOptions>>().Value;

        if (app.Environment.IsDevelopment())
        {
            app.UseSwaggerGen(uiConfig: ui =>
            {
                if (!string.IsNullOrEmpty(authOptions.SwaggerClientId))
                {
                    var oauth2Client = new OAuth2ClientSettings
                    {
                        ClientId = authOptions.SwaggerClientId,
                        ClientSecret = string.Empty,
                        UsePkceWithAuthorizationCodeGrant = true
                    };
                    oauth2Client.Scopes.Add("openid");
                    oauth2Client.Scopes.Add("profile");
                    oauth2Client.Scopes.Add("email");
                    ui.OAuth2Client = oauth2Client;
                    ui.CustomInlineStyles = "div.wrapper:has(input[data-name='clientSecret']) { display: none !important; }";
                }
            });
        }

        app.UseCors(CoreviaFirstCorsExtensions.AllowAllPolicy);
        
        app.UseExceptionHandler();
        app.UseProblemDetailsForStatusCodes();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseFastEndpoints(cfg =>
        {
            cfg.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
            cfg.Serializer.Options.PropertyNameCaseInsensitive = true;
            cfg.Serializer.Options.Converters.Add(new JsonStringEnumConverter());
            cfg.Errors.UseProblemDetails();
        });

        app.MapDefaultEndpoints();

        var indexHtml = Path.Combine(app.Environment.WebRootPath ?? string.Empty, "index.html");
        if (File.Exists(indexHtml))
        {
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.MapFallbackToFile("index.html");
        }

        return app;
    }
}
