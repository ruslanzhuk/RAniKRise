public class EmailChangeStatusDto
{
    public bool InProgress { get; set; }
    public string Step { get; set; } = "none"; 
    public string? PendingEmail { get; set; }
}
