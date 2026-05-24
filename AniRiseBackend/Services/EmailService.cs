using MailKit.Net.Smtp;
using MimeKit;
using AniRiseBackend.Models;
using AniRiseBackend.Data;
namespace AniRiseBackend.Services;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string htmlBody);
    Task SendEmailConfirmationAsync(User user);
}


public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly AppDbContext _db;

    public EmailService(IConfiguration configuration, AppDbContext db)
    {
        _configuration = configuration;
        _db = db;
    }

    public async Task SendEmailAsync(string to, string subject, string htmlBody)
    {
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(_configuration["Email:From"] 
            ?? throw new Exception("Email From not configured")));
        email.To.Add(MailboxAddress.Parse(to));
        email.Subject = subject;
        email.Body = new TextPart("html") { Text = htmlBody };

        using var smtp = new SmtpClient();

        if (!int.TryParse(_configuration["Email:SmtpPort"], out int port))
            throw new Exception("SMTP Port is not configured correctly");

        await smtp.ConnectAsync(
            _configuration["Email:SmtpHost"] ?? throw new Exception("SMTP host not configured"),
            port,
            true
        );

        await smtp.AuthenticateAsync(
            _configuration["Email:SmtpUser"] ?? throw new Exception("SMTP user not configured"),
            _configuration["Email:SmtpPass"] ?? throw new Exception("SMTP password not configured")
        );

        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }


    public async Task SendEmailConfirmationAsync(User user)
    {
        var confirmationLink = $"{_configuration["Frontend:Url"]}/confirm-email?token={user.EmailConfirmationToken}";

        await SendEmailAsync(user.Email, "Confirm your AniRise account",
            $"Click the link: <a href='{confirmationLink}'>Confirm Email</a>");
    }

}