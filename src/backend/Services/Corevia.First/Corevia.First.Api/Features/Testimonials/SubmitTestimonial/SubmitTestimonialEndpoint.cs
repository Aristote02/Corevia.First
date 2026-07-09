using Corevia.First.Api.Authorization;
using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Testimonials.SubmitTestimonial;

public sealed class SubmitTestimonialEndpoint : Endpoint<SubmitTestimonialRequest, TestimonialDto>
{
    private readonly ITestimonialService _testimonials;
    private readonly IAuthService _auth;

    public SubmitTestimonialEndpoint(ITestimonialService testimonials, IAuthService auth)
    {
        _testimonials = testimonials;
        _auth = auth;
    }

    public override void Configure()
    {
        Post("/api/testimonials");
    }

    public override async Task HandleAsync(SubmitTestimonialRequest req, CancellationToken ct)
    {
        var profile = await _auth.GetProfileAsync(User.GetUserId(), ct);
        if (profile is null)
        {
            await Send.UnauthorizedAsync(ct);
            return;
        }

        var result = await _testimonials.SubmitAsync(User.GetUserId(), profile.FullName, req, ct);
        await Send.OkAsync(result, ct);
    }
}
