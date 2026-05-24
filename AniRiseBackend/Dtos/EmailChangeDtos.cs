namespace AniRiseBackend.Dtos;

public class RequestEmailChangeDto
{
    [Required, EmailAddress]
    public string NewEmail { get; set; } = null!;
}

public class ConfirmEmailChangeDto
{
    [Required]
    public string Token { get; set; } = null!;
}
