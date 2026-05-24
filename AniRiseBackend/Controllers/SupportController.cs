using AniRiseBackend.Contracts.Support;
using AniRiseBackend.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/support")]
public class SupportController : ControllerBase
{
    private readonly SupportService _supportService;

    public SupportController(SupportService supportService)
    {
        _supportService = supportService;
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] SupportMessageRequest request)
    {
        await _supportService.HandleSupportMessageAsync(request, User);
        return Ok(new { message = "Support request sent successfully" });
    }
}
