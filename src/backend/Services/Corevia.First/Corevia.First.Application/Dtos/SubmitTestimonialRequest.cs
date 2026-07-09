namespace Corevia.First.Application.Dtos;

public record SubmitTestimonialRequest(
    string CountryFrom,
    string DestinationCountry,
    string University,
    int Rating,
    string TestimonialFr,
    string TestimonialEn);
