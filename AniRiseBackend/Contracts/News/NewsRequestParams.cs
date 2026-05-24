public class NewsRequestParams
{
    public int Limit { get; set; } = 10;
    public int Page { get; set; } = 1;
    public int Offset { get; set; } = 0;
    public string SortBy { get; set; } = "CreatedAt"; // CreatedAt, Title, Author
    public string SortOrder { get; set; } = "desc"; // asc, desc
}
