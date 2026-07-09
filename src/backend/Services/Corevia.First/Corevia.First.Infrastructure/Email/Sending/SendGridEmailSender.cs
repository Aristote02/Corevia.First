using Corevia.First.Domain.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Corevia.First.Infrastructure.Email.Sending;

internal sealed class SendGridEmailSender : IEmailSender
{
    private readonly SendGridClient _sendGrid;
    private readonly EmailNotificationOptions _options;
    private readonly EmbeddedEmailLogoAttachmentProvider _logo;
    private readonly ILogger<SendGridEmailSender> _logger;

    public SendGridEmailSender(
        SendGridClient sendGrid,
        IOptions<EmailNotificationOptions> options,
        EmbeddedEmailLogoAttachmentProvider logo,
        ILogger<SendGridEmailSender> logger)
    {
        _sendGrid = sendGrid;
        _options = options.Value;
        _logo = logo;
        _logger = logger;
    }

    public async Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken cancellationToken = default)
    {
        if (!_options.Enabled)
        {
            _logger.LogDebug("Email skipped (disabled). Subject: {Subject}", subject);
            return;
        }

        var from = new EmailAddress(_options.SenderEmail, _options.SenderName);
        var to = new EmailAddress(toEmail);
        var message = MailHelper.CreateSingleEmail(from, to, subject, string.Empty, htmlBody);

        if (_logo.HasLogo)
        {
            message.AddAttachment(new Attachment
            {
                Content = Convert.ToBase64String(_logo.GetLogoBytes()),
                Type = EmailLogoConstants.ContentType,
                Filename = EmailLogoConstants.FileName,
                Disposition = "inline",
                ContentId = EmailLogoConstants.ContentId,
            });
        }

        var response = await _sendGrid.SendEmailAsync(message, cancellationToken);

        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException($"SendGrid mail send failed with status {(int)response.StatusCode}.");

        _logger.LogInformation("Email sent via SendGrid. Subject: {Subject}", subject);
    }
}
