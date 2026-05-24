public class RequestPasswordResetDto
{
    public string Email { get; set; } = null!;
}

public class ConfirmPasswordResetDto
{
    public string Token { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
}
