using Corevia.First.Application.Abstractions.Services;
using FastEndpoints;

namespace Corevia.First.Api.Features.Testimonials.DeleteTestimonial;

public sealed class DeleteTestimonialEndpoint : Endpoint<DeleteTestimonialRequest>
{
    private readonly ITestimonialService _testimonials;

    public DeleteTestimonialEndpoint(ITestimonialService testimonials) => _testimonials = testimonials;

    public override void Configure()
    {
        Delete("/api/admin/testimonials/{Id}");
        Policies("Admin");
    }

    public override async Task HandleAsync(DeleteTestimonialRequest req, CancellationToken ct)
    {
        var deleted = await _testimonials.DeleteAsync(req.Id, ct);
        if (!deleted)
        {
            await Send.NotFoundAsync(ct);
            return;
        }

        await Send.NoContentAsync(ct);
    }
}
