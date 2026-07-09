using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Configuration;
using Corevia.First.Domain.Constants;
using Corevia.First.Domain.Options;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Corevia.First.Api.Configuration;

public static class JwtBearerExtensions
{
    public static IServiceCollection AddCoreviaFirstJwtBearer(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSection = configuration.GetSection(JwtOptions.SectionName);
        var jwtOptions = jwtSection.Get<JwtOptions>() ?? throw new InvalidOperationException("Jwt options are not configured.");
        if (string.IsNullOrWhiteSpace(jwtOptions.Key))
            throw new InvalidOperationException("Jwt:Key is required.");

        var supabaseOptions = configuration.GetSection(SupabaseOptions.SectionName).Get<SupabaseOptions>() ?? new SupabaseOptions();

        var authBuilder = services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = AuthSchemeNames.SmartBearer;
                options.DefaultChallengeScheme = AuthSchemeNames.SmartBearer;
            })
            .AddPolicyScheme(AuthSchemeNames.SmartBearer, AuthSchemeNames.SmartBearer, options =>
            {
                options.ForwardDefaultSelector = context =>
                {
                    var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
                    if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                        return AuthSchemeNames.CustomJwt;

                    var token = authHeader["Bearer ".Length..].Trim();
                    var handler = new JwtSecurityTokenHandler();
                    if (!handler.CanReadToken(token))
                        return AuthSchemeNames.CustomJwt;

                    var issuer = handler.ReadJwtToken(token).Issuer ?? string.Empty;
                    if (supabaseOptions.Enabled && issuer.Contains("supabase.co", StringComparison.OrdinalIgnoreCase))
                        return AuthSchemeNames.SupabaseJwt;

                    return AuthSchemeNames.CustomJwt;
                };
            })
            .AddJwtBearer(AuthSchemeNames.CustomJwt, options =>
            {
                options.MapInboundClaims = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtOptions.Issuer,
                    ValidAudience = jwtOptions.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key)),
                    RoleClaimType = "role",
                    NameClaimType = JwtRegisteredClaimNames.Sub,
                };

                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async context =>
                    {
                        var jti = context.Principal?.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;
                        if (string.IsNullOrEmpty(jti))
                            return;

                        var blacklist = context.HttpContext.RequestServices.GetRequiredService<ITokenBlacklistService>();
                        if (await blacklist.IsAccessTokenBlacklistedAsync(jti, context.HttpContext.RequestAborted))
                            context.Fail("This token has been revoked.");
                    },
                };
            });

        if (supabaseOptions.Enabled)
        {
            var authority = $"{supabaseOptions.ProjectUrl.TrimEnd('/')}/auth/v1";
            authBuilder.AddJwtBearer(AuthSchemeNames.SupabaseJwt, options =>
            {
                options.MapInboundClaims = false;
                options.Authority = authority;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = authority,
                    ValidateAudience = true,
                    ValidAudience = supabaseOptions.JwtAudience,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    RoleClaimType = "role",
                    NameClaimType = "sub",
                };

                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async context =>
                    {
                        var supabaseAuth = context.HttpContext.RequestServices.GetRequiredService<ISupabaseAuthService>();
                        var profile = await supabaseAuth.ResolveLocalUserAsync(context.Principal!, context.HttpContext.RequestAborted);
                        if (profile is null)
                        {
                            context.Fail("Unable to resolve local user for Supabase session.");
                            return;
                        }

                        if (context.Principal?.Identity is not ClaimsIdentity identity)
                            return;

                        identity.AddClaim(new Claim(AuthSchemeNames.LocalUserIdClaim, profile.Id.ToString()));
                        identity.AddClaim(new Claim("role", profile.Role));
                        if (profile.IsSuperAdmin)
                            identity.AddClaim(new Claim(Application.Auth.AuthClaims.IsSuperAdmin, "true"));
                    },
                };
            });
        }

        services.AddAuthorization();
        return services;
    }
}
