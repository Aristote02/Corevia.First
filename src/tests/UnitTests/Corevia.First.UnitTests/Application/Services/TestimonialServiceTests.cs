using Corevia.First.Application.Abstractions.Repositories;
using Corevia.First.Application.Dtos;
using Corevia.First.Application.Services;
using Corevia.First.Domain.Entities;

namespace Corevia.First.UnitTests.Application.Services;

public sealed class TestimonialServiceTests : UnitTestBase
{
    private readonly IRepository<Testimonial> _testimonials = Substitute.For<IRepository<Testimonial>>();
    private readonly TestimonialService _sut;

    public TestimonialServiceTests() => _sut = new TestimonialService(_testimonials);

    [Fact]
    public async Task SubmitAsync_defaults_english_text_to_french_when_missing()
    {
        // Arrange
        var request = Fixture.Build<SubmitTestimonialRequest>()
            .With(x => x.TestimonialFr, "  Excellent service  ")
            .With(x => x.TestimonialEn, "   ")
            .Create();

        _testimonials.ReturnsPersistedAdd();

        // Act
        var result = await _sut.SubmitAsync(Guid.NewGuid(), "Jamal Raw", request);

        // Assert
        result.TestimonialFr.Should().Be("Excellent service");
        result.TestimonialEn.Should().Be("Excellent service");
        result.IsActive.Should().BeFalse();
        result.StudentName.Should().Be("Jamal Raw");
    }

    [Fact]
    public async Task ToggleActiveAsync_flips_active_flag()
    {
        // Arrange
        var testimonial = Fixture.Build<Testimonial>().With(x => x.IsActive, true).Create();
        _testimonials.ReturnsGetByPredicate([testimonial]);
        _testimonials.ReturnsPersistedAdd();

        // Act
        var result = await _sut.ToggleActiveAsync(testimonial.Id);

        // Assert
        result.Should().NotBeNull();
        result!.IsActive.Should().BeFalse();
        testimonial.IsActive.Should().BeFalse();
    }

    [Fact]
    public async Task ToggleFeaturedAsync_flips_featured_flag()
    {
        // Arrange
        var testimonial = Fixture.Build<Testimonial>().With(x => x.IsFeatured, false).Create();
        _testimonials.ReturnsGetByPredicate([testimonial]);
        _testimonials.ReturnsPersistedAdd();

        // Act
        var result = await _sut.ToggleFeaturedAsync(testimonial.Id);

        // Assert
        result.Should().NotBeNull();
        result!.IsFeatured.Should().BeTrue();
    }

    [Fact]
    public async Task ListApprovedAsync_returns_only_active_testimonials()
    {
        // Arrange
        var active = Fixture.Build<Testimonial>().With(x => x.IsActive, true).Create();
        var inactive = Fixture.Build<Testimonial>().With(x => x.IsActive, false).Create();
        _testimonials.ReturnsQueryable([active, inactive]);

        // Act
        var result = await _sut.ListApprovedAsync();

        // Assert
        result.Should().ContainSingle();
        result[0].Id.Should().Be(active.Id);
    }
}
