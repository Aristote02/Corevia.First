using Corevia.First.Application.Abstractions.Services;
using Corevia.First.Application.Dtos;
using Corevia.First.Domain.Constants;
using Corevia.First.Domain.Options;
using Corevia.First.Infrastructure.Email.Rendering;
using Corevia.First.Infrastructure.Email.Sending;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TemplateNames = Corevia.First.Domain.Constants.EmailTemplateNames;

namespace Corevia.First.Infrastructure.Email.Services;

internal sealed class EmailNotificationService : IEmailNotificationService
{
    private readonly EmailNotificationOptions _options;
    private readonly IMustacheTemplateRenderer _renderer;
    private readonly IEmailSender _sender;
    private readonly IEmailHeaderLogoUrlResolver _headerLogoUrl;
    private readonly ILogger<EmailNotificationService> _logger;

    public EmailNotificationService(
        IOptions<EmailNotificationOptions> options,
        IMustacheTemplateRenderer renderer,
        IEmailSender sender,
        IEmailHeaderLogoUrlResolver headerLogoUrl,
        ILogger<EmailNotificationService> logger)
    {
        _options = options.Value;
        _renderer = renderer;
        _sender = sender;
        _headerLogoUrl = headerLogoUrl;
        _logger = logger;
    }

    public async Task SendPasswordResetAsync(PasswordResetNotification notification, CancellationToken cancellationToken = default)
    {
        if (!_options.Enabled)
            return;

        var html = _renderer.Render(TemplateNames.PasswordReset, new
        {
            recipientName = NameOrDefault(notification.RecipientName),
            resetLink = BuildResetLink(notification.ResetToken, notification.RecipientEmail),
            expiresAtUtc = FormatUtc(notification.ExpiresAtUtc),
            logoUrl = _headerLogoUrl.Resolve(),
        });

        await _sender.SendAsync(notification.RecipientEmail, _options.PasswordResetSubject, html, cancellationToken);
        _logger.LogInformation("Password reset email queued for {Email}.", notification.RecipientEmail);
    }

    public async Task SendPasswordChangedAsync(PasswordChangedNotification notification, CancellationToken cancellationToken = default)
    {
        if (!_options.Enabled)
            return;

        var html = _renderer.Render(TemplateNames.PasswordChanged, new
        {
            recipientName = NameOrDefault(notification.RecipientName),
            changedAtUtc = FormatUtc(notification.ChangedAtUtc),
            logoUrl = _headerLogoUrl.Resolve(),
        });

        await _sender.SendAsync(notification.RecipientEmail, _options.PasswordChangedSubject, html, cancellationToken);
        _logger.LogInformation("Password changed email sent to {Email}.", notification.RecipientEmail);
    }

    public async Task SendWelcomeAsync(WelcomeNotification notification, CancellationToken cancellationToken = default)
    {
        if (!_options.Enabled)
            return;

        var html = _renderer.Render(TemplateNames.Welcome, new
        {
            recipientName = NameOrDefault(notification.RecipientName),
            signInLink = BuildSignInLink(),
            logoUrl = _headerLogoUrl.Resolve(),
        });

        await _sender.SendAsync(notification.RecipientEmail, _options.WelcomeSubject, html, cancellationToken);
        _logger.LogInformation("Welcome email sent to {Email}.", notification.RecipientEmail);
    }

    private string BuildSignInLink()
    {
        var baseUrl = _options.FrontendBaseUrl.TrimEnd('/');
        var path = _options.SignInPath.StartsWith('/') ? _options.SignInPath : "/" + _options.SignInPath;
        return $"{baseUrl}{path}";
    }

    private string BuildResetLink(string token, string email)
    {
        var baseUrl = _options.FrontendBaseUrl.TrimEnd('/');
        var path = _options.ResetPasswordPath.StartsWith('/') ? _options.ResetPasswordPath : "/" + _options.ResetPasswordPath;
        return $"{baseUrl}{path}?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(email)}";
    }

    private static string NameOrDefault(string? recipientName) =>
        string.IsNullOrWhiteSpace(recipientName) ? "there" : recipientName;

    private static string FormatUtc(DateTimeOffset ts) => ts.ToString("yyyy-MM-dd HH:mm 'UTC'");
}
