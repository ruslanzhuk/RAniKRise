public class ClubRequestParams
{
    public int Limit { get; set; } = 10;

    public int Page { get; set; } = 1;


    public int Offset { get; set; } = 0;

    public string SortBy { get; set; } = "CreatedAt";

    public string SortOrder { get; set; } = "desc";

    public string? Name { get; set; } = null;
}