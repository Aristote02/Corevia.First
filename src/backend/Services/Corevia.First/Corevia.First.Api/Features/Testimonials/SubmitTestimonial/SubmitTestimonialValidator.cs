using Corevia.First.Application.Dtos;
using FastEndpoints;
using FluentValidation;

namespace Corevia.First.Api.Features.Testimonials.SubmitTestimonial;

public sealed class SubmitTestimonialValidator : Validator<SubmitTestimonialRequest>
{
    public SubmitTestimonialValidator()
    {
        RuleFor(x => x.CountryFrom).NotEmpty().MaximumLength(100);
        RuleFor(x => x.DestinationCountry).NotEmpty().MaximumLength(100);
        RuleFor(x => x.University).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Rating).InclusiveBetween(1, 5);
        RuleFor(x => x.TestimonialFr).NotEmpty().MaximumLength(5000);
        RuleFor(x => x.TestimonialEn).NotEmpty().MaximumLength(5000);
    }
}
