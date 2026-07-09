using Corevia.First.Domain.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Corevia.First.Infrastructure.Email;

internal interface IEmailHeaderLogoUrlResolver
{
    string? Resolve();
}

/// <summary>
/// Uses the embedded <c>corevia-mark.jpg</c> as a SendGrid inline attachment (cid),
/// or falls back to <see cref="EmailNotificationOptions.LogoUrl"/> when configured.
/// </summary>
internal sealed class EmailHeaderLogoUrlResolver : IEmailHeaderLogoUrlResolver
{
    private readonly EmbeddedEmailLogoAttachmentProvider _logo;
    private readonly EmailNotificationOptions _options;
    private readonly ILogger<EmailHeaderLogoUrlResolver> _logger;

    public EmailHeaderLogoUrlResolver(
        EmbeddedEmailLogoAttachmentProvider logo,
        IOptions<EmailNotificationOptions> options,
        ILogger<EmailHeaderLogoUrlResolver> logger)
    {
        _logo = logo;
        _options = options.Value;
        _logger = logger;
    }

    public string? Resolve()
    {
        if (_logo.HasLogo)
            return EmailLogoConstants.CidReference;

        var trimmed = _options.LogoUrl?.Trim();
        if (string.IsNullOrEmpty(trimmed))
        {
            _logger.LogDebug("No embedded email logo and Email:LogoUrl is empty; header image omitted.");
            return null;
        }

        if (!Uri.TryCreate(trimmed, UriKind.Absolute, out var logoUri)
            || !string.Equals(logoUri.Scheme, Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase))
        {
            _logger.LogWarning("Email:LogoUrl must be a valid https URL; header image omitted.");
            return null;
        }

        return trimmed;
    }
}
