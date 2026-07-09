using Corevia.First.Application.Dtos;
using Corevia.First.Domain.Options;
using FastEndpoints;
using Microsoft.Extensions.Options;

namespace Corevia.First.Api.Features.Auth.GetAuthConfig;

public sealed class GetAuthConfigEndpoint : EndpointWithoutRequest<AuthConfigDto>
{
    private readonly SupabaseOptions _supabase;

    public GetAuthConfigEndpoint(IOptions<SupabaseOptions> supabase) => _supabase = supabase.Value;

    public override void Configure()
    {
        Get("/api/auth/config");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        await Send.OkAsync(new AuthConfigDto(
            _supabase.Enabled,
            _supabase.Enabled ? _supabase.ProjectUrl : null,
            _supabase.Enabled ? _supabase.AnonKey : null), ct);
    }
}
