using Corevia.First.Application.Abstractions.Repositories;
using Corevia.First.Application.Dtos;
using Corevia.First.Application.Services;
using Corevia.First.Domain.Constants;
using Corevia.First.Domain.Entities;

namespace Corevia.First.UnitTests.Application.Services;

public sealed class ContactServiceTests : UnitTestBase
{
    private readonly IRepository<Contact> _contacts = Substitute.For<IRepository<Contact>>();
    private readonly ContactService _sut;

    public ContactServiceTests()
    {
        _sut = new ContactService(_contacts);
    }

    [Fact]
    public async Task SubmitAsync_normalizes_input_and_persists_contact()
    {
        // Arrange
        var request = Fixture.Build<SubmitContactRequest>()
            .With(x => x.Name, "  Jamal Raw  ")
            .With(x => x.Email, "  Test@Example.COM  ")
            .With(x => x.Phone, "  +123  ")
            .With(x => x.Country, "  FR  ")
            .With(x => x.Message, "  Hello  ")
            .Create();

        _contacts.ReturnsPersistedAdd();

        // Act
        var result = await _sut.SubmitAsync(request);

        // Assert
        result.Name.Should().Be("Jamal Raw");
        result.Email.Should().Be("test@example.com");
        result.Status.Should().Be(ContactStatuses.Nouveau);

        await _contacts.Received(1).AddAsync(
            Arg.Is<Contact>(c =>
                c.Name == "Jamal Raw" &&
                c.Email == "test@example.com" &&
                c.Phone == "+123" &&
                c.Country == "FR" &&
                c.Message == "Hello"),
            Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task UpdateStatusAsync_when_contact_exists_updates_status()
    {
        // Arrange
        var contact = Fixture.Create<Contact>();
        _contacts.ReturnsGetByPredicate([contact]);
        _contacts.ReturnsPersistedAdd();

        // Act
        var result = await _sut.UpdateStatusAsync(contact.Id, ContactStatuses.Traite);

        // Assert
        result.Should().NotBeNull();
        result!.Status.Should().Be(ContactStatuses.Traite);
        contact.Status.Should().Be(ContactStatuses.Traite);
    }

    [Fact]
    public async Task UpdateStatusAsync_when_contact_missing_returns_null()
    {
        // Arrange
        _contacts.ReturnsGetByPredicate(Array.Empty<Contact>());

        // Act
        var result = await _sut.UpdateStatusAsync(Guid.NewGuid(), ContactStatuses.Traite);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task DeleteAsync_when_contact_exists_returns_true()
    {
        // Arrange
        var contact = Fixture.Create<Contact>();
        _contacts.ReturnsGetByPredicate([contact]);
        _contacts.ReturnsDeleted();

        // Act
        var result = await _sut.DeleteAsync(contact.Id);

        // Assert
        result.Should().BeTrue();
        await _contacts.Received(1).DeleteAsync(contact, Arg.Any<CancellationToken>());
    }
}
