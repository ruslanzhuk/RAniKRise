using AniRiseBackend.Contracts.Support;
using AniRiseBackend.Data;
using AniRiseBackend.Helpers;
using AniRiseBackend.Models;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace AniRiseBackend.Services;
public class SupportService
{
    private readonly ILogger<SupportService> _logger;
    private readonly AppDbContext _dbContext;
    private readonly IEmailService _emailService;

    public SupportService(
        ILogger<SupportService> logger,
        AppDbContext dbContext,
        IEmailService emailService)
    {
        _logger = logger;
        _dbContext = dbContext;
        _emailService = emailService;
    }

    public async Task HandleSupportMessageAsync(
        SupportMessageRequest request,
        ClaimsPrincipal? user)
    {
        Guid? userId = null;
        if (user?.Identity?.IsAuthenticated == true)
            userId = user.GetUserId();

        var supportMessage = new SupportMessage
        {
            UserId = userId,
            Email = request.Email,
            Message = request.Message
        };

        _dbContext.SupportMessages.Add(supportMessage);
        await _dbContext.SaveChangesAsync();

        var adminEmail = "gozuaaaa7@gmail.com";

        var adminSubject = "New Support Message - AniRise";
        var adminBody = $"""
            <h2>New Support Message</h2>
            <p><strong>From:</strong> {request.Email}</p>
            <p><strong>User ID:</strong> {(userId.HasValue ? userId.ToString() : "Guest")}</p>
            <p><strong>Message:</strong></p>
            <p>{request.Message}</p>
            <hr />
            <p><small>Sent from AniRise Support Module</small></p>
            """;

        await _emailService.SendEmailAsync(adminEmail, adminSubject, adminBody);

        var userSubject = "We received your support request - AniRise";
        var userBody = """
            <p>Hello,</p>
            <p>Thank you for contacting the AniRise support team.</p>
            <p>We have successfully received your message and will review it as soon as possible.</p>
            <p><strong>Please note:</strong> our team will respond within <strong>5 business days</strong>.</p>
            <p>If your issue requires additional information, we will contact you using this email address.</p>
            <br />
            <p>Best regards,<br />AniRise Support Team</p>
            <hr />
            <p><small>This is an automated message. Please do not reply directly.</small></p>
            """;

        await _emailService.SendEmailAsync(request.Email, userSubject, userBody);

        _logger.LogInformation(
            "Support message processed. UserId={UserId}, Email={Email}",
            userId,
            request.Email
        );
    }
}

