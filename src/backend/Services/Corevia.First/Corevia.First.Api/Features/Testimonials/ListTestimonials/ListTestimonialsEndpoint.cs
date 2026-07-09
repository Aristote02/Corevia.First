using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Testimonials.ListTestimonials;

public sealed class ListTestimonialsEndpoint : EndpointWithoutRequest<IReadOnlyList<TestimonialDto>>
{
    private readonly ITestimonialService _testimonials;

    public ListTestimonialsEndpoint(ITestimonialService testimonials) => _testimonials = testimonials;

    public override void Configure()
    {
        Get("/api/testimonials");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var items = await _testimonials.ListApprovedAsync(ct);
        await Send.OkAsync(items, ct);
    }
}
