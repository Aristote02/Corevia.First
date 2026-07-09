namespace Corevia.First.Application.Dtos;

public record TestimonialDto(
    Guid Id,
    string StudentName,
    string CountryFrom,
    string DestinationCountry,
    string University,
    int Rating,
    string TestimonialFr,
    string TestimonialEn,
    string PhotoUrl,
    int Year,
    bool IsFeatured,
    bool IsActive,
    DateTimeOffset CreatedAt);
