using Corevia.First.Application.Abstractions.Repositories;
using Corevia.First.Application.Services;
using Corevia.First.Domain.Entities;

namespace Corevia.First.UnitTests.Application.Services;

public sealed class CatalogServiceTests : UnitTestBase
{
    private readonly IRepository<Destination> _destinations = Substitute.For<IRepository<Destination>>();
    private readonly IRepository<AgencyService> _services = Substitute.For<IRepository<AgencyService>>();
    private readonly IRepository<Faq> _faqs = Substitute.For<IRepository<Faq>>();
    private readonly IRepository<VisaPackage> _visaPackages = Substitute.For<IRepository<VisaPackage>>();
    private readonly IRepository<Statistic> _statistics = Substitute.For<IRepository<Statistic>>();
    private readonly IRepository<GalleryUniversity> _gallery = Substitute.For<IRepository<GalleryUniversity>>();
    private readonly CatalogService _sut;

    public CatalogServiceTests() =>
        _sut = new CatalogService(_destinations, _services, _faqs, _visaPackages, _statistics, _gallery);

    [Fact]
    public async Task GetDestinationsAsync_returns_only_active_items_ordered_by_display_order()
    {
        // Arrange
        var activeFirst = Fixture.Build<Destination>().With(x => x.IsActive, true).With(x => x.DisplayOrder, 1).Create();
        var activeSecond = Fixture.Build<Destination>().With(x => x.IsActive, true).With(x => x.DisplayOrder, 2).Create();
        var inactive = Fixture.Build<Destination>().With(x => x.IsActive, false).Create();

        _destinations.ReturnsQueryable([activeSecond, inactive, activeFirst]);

        // Act
        var result = await _sut.GetDestinationsAsync();

        // Assert
        result.Should().HaveCount(2);
        result[0].Id.Should().Be(activeFirst.Id);
        result[1].Id.Should().Be(activeSecond.Id);
    }

    [Fact]
    public async Task GetFaqsAsync_returns_only_active_faqs()
    {
        // Arrange
        var active = Fixture.Build<Faq>().With(x => x.IsActive, true).Create();
        var inactive = Fixture.Build<Faq>().With(x => x.IsActive, false).Create();
        _faqs.ReturnsQueryable([inactive, active]);

        // Act
        var result = await _sut.GetFaqsAsync();

        // Assert
        result.Should().ContainSingle().Which.Id.Should().Be(active.Id);
    }

    [Fact]
    public async Task GetVisaPackagesAsync_returns_only_active_packages_ordered_by_country()
    {
        // Arrange
        var france = Fixture.Build<VisaPackage>().With(x => x.IsActive, true).With(x => x.Country, "France").Create();
        var germany = Fixture.Build<VisaPackage>().With(x => x.IsActive, true).With(x => x.Country, "Germany").Create();
        var inactive = Fixture.Build<VisaPackage>().With(x => x.IsActive, false).Create();

        _visaPackages.ReturnsQueryable([germany, inactive, france]);

        // Act
        var result = await _sut.GetVisaPackagesAsync();

        // Assert
        result.Should().HaveCount(2);
        result[0].Country.Should().Be("France");
        result[1].Country.Should().Be("Germany");
    }
}
