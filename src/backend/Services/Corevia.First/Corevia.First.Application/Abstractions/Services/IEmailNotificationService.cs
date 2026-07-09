using Corevia.First.Application.Dtos;

namespace Corevia.First.Application.Abstractions.Services;

public interface IEmailNotificationService
{
    Task SendPasswordResetAsync(PasswordResetNotification notification, CancellationToken cancellationToken = default);
    Task SendPasswordChangedAsync(PasswordChangedNotification notification, CancellationToken cancellationToken = default);
    Task SendWelcomeAsync(WelcomeNotification notification, CancellationToken cancellationToken = default);
}
