using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Testimonials.ToggleTestimonialActive;

public sealed class ToggleTestimonialActiveEndpoint : Endpoint<ToggleTestimonialActiveRequest, TestimonialDto>
{
    private readonly ITestimonialService _testimonials;

    public ToggleTestimonialActiveEndpoint(ITestimonialService testimonials) => _testimonials = testimonials;

    public override void Configure()
    {
        Patch("/api/admin/testimonials/{Id}/toggle-active");
        Policies("Admin");
    }

    public override async Task HandleAsync(ToggleTestimonialActiveRequest req, CancellationToken ct)
    {
        var result = await _testimonials.ToggleActiveAsync(req.Id, ct);
        if (result is null)
        {
            await Send.NotFoundAsync(ct);
            return;
        }

        await Send.OkAsync(result, ct);
    }
}
