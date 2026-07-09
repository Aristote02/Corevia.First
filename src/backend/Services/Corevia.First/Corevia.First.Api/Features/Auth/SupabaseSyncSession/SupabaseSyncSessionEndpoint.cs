using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;
using FluentValidation;

namespace Corevia.First.Api.Features.Auth.SupabaseSyncSession;

public sealed class SupabaseSyncSessionEndpoint : Endpoint<SupabaseSessionRequest, SupabaseSessionResponse>
{
    private readonly ISupabaseAuthService _supabaseAuth;

    public SupabaseSyncSessionEndpoint(ISupabaseAuthService supabaseAuth) => _supabaseAuth = supabaseAuth;

    public override void Configure()
    {
        Post("/api/auth/supabase/sync");
        AllowAnonymous();
    }

    public override async Task HandleAsync(SupabaseSessionRequest req, CancellationToken ct)
    {
        var profile = await _supabaseAuth.SyncSessionAsync(req.AccessToken, ct);
        if (profile is null)
        {
            await Send.UnauthorizedAsync(ct);
            return;
        }

        await Send.OkAsync(new SupabaseSessionResponse(profile), ct);
    }
}

public sealed class SupabaseSyncSessionValidator : Validator<SupabaseSessionRequest>
{
    public SupabaseSyncSessionValidator()
    {
        RuleFor(x => x.AccessToken).NotEmpty();
    }
}
