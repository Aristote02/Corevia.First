using Corevia.First.Application.Abstractions.Repositories;
using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using Corevia.First.Application.Mapping;
using Corevia.First.Domain.Entities;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Corevia.First.Application.Services;

public sealed class TestimonialService : ITestimonialService
{
    private readonly IRepository<Testimonial> _testimonials;

    public TestimonialService(IRepository<Testimonial> testimonials) => _testimonials = testimonials;

    public async Task<IReadOnlyList<TestimonialDto>> ListApprovedAsync(CancellationToken cancellationToken = default)
    {
        var items = await _testimonials.Query().AsNoTracking()
            .Where(t => t.IsActive)
            .OrderByDescending(t => t.IsFeatured)
            .ThenByDescending(t => t.CreatedAt)
            .ToListAsync(cancellationToken);

        return items.Adapt<List<TestimonialDto>>();
    }

    public async Task<IReadOnlyList<TestimonialDto>> ListAllAsync(CancellationToken cancellationToken = default)
    {
        var items = await _testimonials.Query().AsNoTracking()
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync(cancellationToken);

        return items.Adapt<List<TestimonialDto>>();
    }

    public async Task<TestimonialDto> SubmitAsync(Guid userId, string studentName, SubmitTestimonialRequest request, CancellationToken cancellationToken = default)
    {
        _ = userId;
        var testimonial = new Testimonial
        {
            Id = Guid.NewGuid(),
            StudentName = studentName,
            CountryFrom = request.CountryFrom.Trim(),
            DestinationCountry = request.DestinationCountry.Trim(),
            University = request.University.Trim(),
            Rating = request.Rating,
            TestimonialFr = request.TestimonialFr.Trim(),
            TestimonialEn = string.IsNullOrWhiteSpace(request.TestimonialEn)
                ? request.TestimonialFr.Trim()
                : request.TestimonialEn.Trim(),
            Year = DateTime.UtcNow.Year,
            IsActive = false,
            IsFeatured = false,
            CreatedAt = DateTimeOffset.UtcNow,
        };

        await _testimonials.AddAsync(testimonial, cancellationToken);
        await _testimonials.SaveChangesAsync(cancellationToken);
        
        return testimonial.ToDto();
    }

    public async Task<TestimonialDto?> ToggleActiveAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var item = await _testimonials.GetAsync(t => t.Id == id, cancellationToken, asNoTracking: false);
        if (item is null)
            return null;

        item.IsActive = !item.IsActive;
        await _testimonials.SaveChangesAsync(cancellationToken);
        
        return item.ToDto();
    }

    public async Task<TestimonialDto?> ToggleFeaturedAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var item = await _testimonials.GetAsync(t => t.Id == id, cancellationToken, asNoTracking: false);
        if (item is null)
            return null;

        item.IsFeatured = !item.IsFeatured;
        await _testimonials.SaveChangesAsync(cancellationToken);
        
        return item.ToDto();
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var item = await _testimonials.GetAsync(t => t.Id == id, cancellationToken, asNoTracking: false);
        if (item is null)
            return false;

        await _testimonials.DeleteAsync(item, cancellationToken);
        await _testimonials.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}
