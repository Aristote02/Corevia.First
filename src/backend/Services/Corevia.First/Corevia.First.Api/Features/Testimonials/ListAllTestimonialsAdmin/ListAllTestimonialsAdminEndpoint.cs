using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using FastEndpoints;

namespace Corevia.First.Api.Features.Testimonials.ListAllTestimonialsAdmin;

public sealed class ListAllTestimonialsAdminEndpoint : EndpointWithoutRequest<IReadOnlyList<TestimonialDto>>
{
    private readonly ITestimonialService _testimonials;

    public ListAllTestimonialsAdminEndpoint(ITestimonialService testimonials) => _testimonials = testimonials;

    public override void Configure()
    {
        Get("/api/admin/testimonials");
        Policies("Admin");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var items = await _testimonials.ListAllAsync(ct);
        await Send.OkAsync(items, ct);
    }
}
