using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Testimonials.ToggleTestimonialFeatured;

public sealed class ToggleTestimonialFeaturedEndpoint : Endpoint<ToggleTestimonialFeaturedRequest, TestimonialDto>
{
    private readonly ITestimonialService _testimonials;

    public ToggleTestimonialFeaturedEndpoint(ITestimonialService testimonials) => _testimonials = testimonials;

    public override void Configure()
    {
        Patch("/api/admin/testimonials/{Id}/toggle-featured");
        Policies("Admin");
    }

    public override async Task HandleAsync(ToggleTestimonialFeaturedRequest req, CancellationToken ct)
    {
        var result = await _testimonials.ToggleFeaturedAsync(req.Id, ct);
        if (result is null)
        {
            await Send.NotFoundAsync(ct);
            return;
        }

        await Send.OkAsync(result, ct);
    }
}
