using Corevia.First.Domain.Constants;

namespace Corevia.First.Domain.Options;

public sealed record EmailNotificationOptions : ICoreviaFirstOptions
{
    public static string SectionName => "Email";

    public bool Enabled { get; init; }
    public string SendGridApiKey { get; init; } = string.Empty;
    public string SenderEmail { get; init; } = string.Empty;
    public string SenderName { get; init; } = EmailDefaults.SenderName;
    public string LogoUrl { get; init; } = string.Empty;
    public string FrontendBaseUrl { get; init; } = string.Empty;
    public string ResetPasswordPath { get; init; } = EmailDefaults.ResetPasswordPath;
    public string SignInPath { get; init; } = EmailDefaults.SignInPath;
    public string PasswordResetSubject { get; init; } = EmailDefaults.PasswordResetSubject;
    public string PasswordChangedSubject { get; init; } = EmailDefaults.PasswordChangedSubject;
    public string WelcomeSubject { get; init; } = EmailDefaults.WelcomeSubject;
}
