using Corevia.First.Application.Abstractions.Repositories;
using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using Corevia.First.Application.Mapping;
using Corevia.First.Domain.Constants;
using Corevia.First.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Corevia.First.Application.Services;

public sealed class ContactService : IContactService
{
    private readonly IRepository<Contact> _contacts;

    public ContactService(IRepository<Contact> contacts) => _contacts = contacts;

    public async Task<ContactDto> SubmitAsync(SubmitContactRequest request, CancellationToken cancellationToken = default)
    {
        var contact = new Contact
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim(),
            Country = string.IsNullOrWhiteSpace(request.Country) ? null : request.Country.Trim(),
            Message = request.Message.Trim(),
            Status = ContactStatuses.Nouveau,
            CreatedAt = DateTimeOffset.UtcNow,
        };

        await _contacts.AddAsync(contact, cancellationToken);
        await _contacts.SaveChangesAsync(cancellationToken);
        return contact.ToDto();
    }

    public async Task<PagedResponse<ContactDto>> ListAsync(int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = _contacts.Query().AsNoTracking();
        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return items.ToPagedResponse<Contact, ContactDto>(page, pageSize, total);
    }

    public async Task<ContactDto?> UpdateStatusAsync(Guid id, string status, CancellationToken cancellationToken = default)
    {
        var contact = await _contacts.GetAsync(c => c.Id == id, cancellationToken, asNoTracking: false);
        if (contact is null)
            return null;

        contact.Status = status;
        await _contacts.SaveChangesAsync(cancellationToken);
        return contact.ToDto();
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var contact = await _contacts.GetAsync(c => c.Id == id, cancellationToken, asNoTracking: false);
        if (contact is null)
            return false;

        await _contacts.DeleteAsync(contact, cancellationToken);
        await _contacts.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}
