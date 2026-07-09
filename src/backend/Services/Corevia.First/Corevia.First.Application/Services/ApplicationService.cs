using Corevia.First.Application.Abstractions.Repositories;
using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using Corevia.First.Application.Mapping;
using Corevia.First.Domain.Constants;
using ApplicationEntity = Corevia.First.Domain.Entities.Application;
using Corevia.First.Domain.Entities;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Corevia.First.Application.Services;

public sealed class ApplicationService : IApplicationService
{
    private readonly IRepository<ApplicationEntity> _applications;
    private readonly IRepository<ApplicationHistory> _history;
    private readonly IUserRepository _users;
    private readonly IRepository<Contact> _contacts;

    public ApplicationService(
        IRepository<ApplicationEntity> applications,
        IRepository<ApplicationHistory> history,
        IUserRepository users,
        IRepository<Contact> contacts)
    {
        _applications = applications;
        _history = history;
        _users = users;
        _contacts = contacts;
    }

    public async Task<ApplicationDto> SubmitAsync(SubmitApplicationRequest request, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var application = new ApplicationEntity
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            ApplicationNumber = await GenerateApplicationNumberAsync(cancellationToken),
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim(),
            Country = request.Country.Trim(),
            Service = request.Service.Trim(),
            Message = request.Message.Trim(),
            Status = ApplicationStatuses.User.Nouveau,
            AdminStatus = ApplicationStatuses.Admin.Nouveau,
            CreatedAt = now,
            UpdatedAt = now,
        };

        await _applications.AddAsync(application, cancellationToken);
        await _applications.SaveChangesAsync(cancellationToken);

        return application.ToDto();
    }

    public async Task<PagedResponse<ApplicationDto>> ListAsync(int page, int pageSize, string? statusFilter, string? search, CancellationToken cancellationToken = default)
    {
        var query = _applications.Query().AsNoTracking();

        if (!string.IsNullOrWhiteSpace(statusFilter) && statusFilter != "all")
            query = query.Where(a => a.Status == statusFilter);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLowerInvariant();
            query = query.Where(a =>
                a.ApplicationNumber.ToLower().Contains(term) ||
                a.FullName.ToLower().Contains(term) ||
                a.Email.ToLower().Contains(term) ||
                (a.Phone != null && a.Phone.Contains(term)) ||
                (a.Country != null && a.Country.ToLower().Contains(term)));
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return items.ToPagedResponse<ApplicationEntity, ApplicationDto>(page, pageSize, total);
    }

    public async Task<IReadOnlyList<ApplicationDto>> ListByUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var items = await _applications.Query().AsNoTracking()
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);

        return items.Adapt<List<ApplicationDto>>();
    }

    public async Task<ApplicationDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var app = await _applications.GetAsync(a => a.Id == id, cancellationToken);
        
        return app?.ToDto();
    }

    public async Task<ApplicationDto?> UpdateAdminStatusAsync(Guid id, Guid adminUserId, string adminStatus, string? notes, CancellationToken cancellationToken = default)
    {
        var app = await _applications.GetAsync(a => a.Id == id, cancellationToken, asNoTracking: false);
        if (app is null)
            return null;

        var oldStatus = app.AdminStatus;
        app.AdminStatus = adminStatus;
        app.Status = ApplicationStatuses.SyncUserStatusFromAdmin(adminStatus);
        app.UpdatedAt = DateTimeOffset.UtcNow;

        await _history.AddAsync(new ApplicationHistory
        {
            Id = Guid.NewGuid(),
            ApplicationId = app.Id,
            OldStatus = oldStatus,
            NewStatus = adminStatus,
            ChangedBy = adminUserId,
            Notes = notes,
            CreatedAt = DateTimeOffset.UtcNow,
        }, cancellationToken);

        await _applications.SaveChangesAsync(cancellationToken);
        
        return app.ToDto();
    }

    public async Task<ApplicationDto?> UpdateNotesAsync(Guid id, string adminNotes, CancellationToken cancellationToken = default)
    {
        var app = await _applications.GetAsync(a => a.Id == id, cancellationToken, asNoTracking: false);
        if (app is null)
            return null;

        app.AdminNotes = adminNotes;
        app.UpdatedAt = DateTimeOffset.UtcNow;
        await _applications.SaveChangesAsync(cancellationToken);
        
        return app.ToDto();
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var app = await _applications.GetAsync(a => a.Id == id, cancellationToken, asNoTracking: false);
        if (app is null)
            return false;

        await _applications.DeleteAsync(app, cancellationToken);
        await _applications.SaveChangesAsync(cancellationToken);
        
        return true;
    }

    public async Task<IReadOnlyList<ApplicationHistoryDto>> GetHistoryAsync(Guid applicationId, CancellationToken cancellationToken = default)
    {
        var items = await _history.Query().AsNoTracking()
            .Where(h => h.ApplicationId == applicationId)
            .OrderByDescending(h => h.CreatedAt)
            .ToListAsync(cancellationToken);

        return items.Adapt<List<ApplicationHistoryDto>>();
    }

    public async Task<AdminOverviewStatsDto> GetOverviewStatsAsync(CancellationToken cancellationToken = default)
    {
        var apps = _applications.Query().AsNoTracking();
        var total = await apps.CountAsync(cancellationToken);
        var nouveau = await apps.CountAsync(a => a.Status == ApplicationStatuses.User.Nouveau, cancellationToken);
        var enCours = await apps.CountAsync(a => a.Status == ApplicationStatuses.User.EnCours, cancellationToken);
        var cloture = await apps.CountAsync(a => a.Status == ApplicationStatuses.User.Cloture, cancellationToken);

        var recent = await apps
            .OrderByDescending(a => a.CreatedAt)
            .Take(5)
            .ToListAsync(cancellationToken);

        var totalUsers = await _users.CountAsync(_ => true, cancellationToken);
        var totalContacts = await _contacts.CountAsync(_ => true, cancellationToken);

        return recent.ToAdminOverviewStatsDto(total, nouveau, enCours, cloture, totalUsers, totalContacts);
    }

    private async Task<string> GenerateApplicationNumberAsync(CancellationToken cancellationToken)
    {
        var numbers = await _applications.Query().AsNoTracking()
            .Where(a => a.ApplicationNumber.StartsWith("APP"))
            .Select(a => a.ApplicationNumber)
            .ToListAsync(cancellationToken);

        var max = 0;
        foreach (var num in numbers)
        {
            if (num.Length > 3 && int.TryParse(num[3..], out var parsed))
                max = Math.Max(max, parsed);
        }

        return $"APP{(max + 1).ToString().PadLeft(5, '0')}";
    }
}
