namespace Corevia.First.Domain.Entities;

public class Testimonial
{
    public Guid Id { get; set; }

    public string StudentName { get; set; } = string.Empty;

    public string CountryFrom { get; set; } = string.Empty;

    public string DestinationCountry { get; set; } = string.Empty;

    public string University { get; set; } = string.Empty;

    public int Rating { get; set; } = 5;

    public string TestimonialFr { get; set; } = string.Empty;

    public string TestimonialEn { get; set; } = string.Empty;

    public string PhotoUrl { get; set; } = string.Empty;

    public int Year { get; set; }

    public bool IsFeatured { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTimeOffset CreatedAt { get; set; }
}
