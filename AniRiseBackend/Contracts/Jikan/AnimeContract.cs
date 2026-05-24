using System.Text.Json.Serialization;

public class JikanAnimeResponse
{
    [JsonPropertyName("data")]
    public JikanAnimeData Data { get; set; } = null!;
}


public class JikanListResponse
{
    [JsonPropertyName("data")]
    public List<JikanAnimeData> Data { get; set; } = new();
}


public class JikanAnimeData
{
    [JsonPropertyName("mal_id")]
    public long MalId { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = null!;

    [JsonPropertyName("title_japanese")]
    public string? TitleJapanese { get; set; }

    [JsonPropertyName("synopsis")]
    public string? Synopsis { get; set; }

    [JsonPropertyName("episodes")]
    public int? Episodes { get; set; }

    [JsonPropertyName("status")]
    public string? Status { get; set; }

    [JsonPropertyName("type")]
    public string? Type { get; set; }

    [JsonPropertyName("score")]
    public float? Score { get; set; }

    [JsonPropertyName("scored_by")]
    public int? ScoredBy { get; set; }

    [JsonPropertyName("rank")]
    public int? Rank { get; set; }

    [JsonPropertyName("aired")]
    public JikanAnimeAired? Aired { get; set; }

    [JsonPropertyName("genres")]
    public List<JikanGenre> Genres { get; set; } = new();

    [JsonPropertyName("studios")]
    public List<JikanStudio> Studios { get; set; } = new();

    [JsonPropertyName("authors")]
    public List<JikanAuthor> Authors { get; set; } = new();

    [JsonPropertyName("images")]
    public JikanImages? Images { get; set; }
}

public class JikanAnimeAired
{
    [JsonPropertyName("from")]
    public DateTime? From { get; set; }

    [JsonPropertyName("to")]
    public DateTime? To { get; set; }
}

public class JikanGenre { [JsonPropertyName("name")] public string Name { get; set; } = null!; }
public class JikanStudio { [JsonPropertyName("name")] public string Name { get; set; } = null!; }
public class JikanAuthor { 
    [JsonPropertyName("name")] public string Name { get; set; } = null!;
    [JsonPropertyName("role")] public string? Role { get; set; }
}

public class JikanImages
{
    [JsonPropertyName("jpg")]
    public JikanImageJPG? Jpg { get; set; }
}

public class JikanImageJPG
{
    [JsonPropertyName("image_url")]
    public string? ImageUrl { get; set; }

    [JsonPropertyName("large_image_url")]
    public string? LargeImageUrl { get; set; }
}

public class JikanStaffResponse
{
    [JsonPropertyName("data")]
    public List<JikanStaffData> Data { get; set; } = new();
}

public class JikanStaffData
{
    [JsonPropertyName("person")]
    public JikanPerson Person { get; set; } = null!;

    [JsonPropertyName("positions")]
    public List<string> Positions { get; set; } = new();
}

public class JikanPerson
{
    [JsonPropertyName("mal_id")]
    public long MalId { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = null!;

    [JsonPropertyName("images")]
    public JikanImages? Images { get; set; }
}

public class JikanCharactersResponse
{
    [JsonPropertyName("data")]
    public List<JikanCharacterData> Data { get; set; } = new();
}

public class JikanCharacterData
{
    [JsonPropertyName("character")]
    public JikanCharacter Character { get; set; } = null!;

    [JsonPropertyName("role")]
    public string Role { get; set; } = null!;
}

public class JikanCharacter
{
    [JsonPropertyName("mal_id")]
    public long MalId { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = null!;

    [JsonPropertyName("images")]
    public JikanImages? Images { get; set; }
}

public class JikanCharacterFullResponse
{
    [JsonPropertyName("role")]
    public string Role { get; set; } = null!;
    
    [JsonPropertyName("data")]
    public JikanCharacterFull Data { get; set; } = null!;
}

public class JikanCharacterFull
{
    [JsonPropertyName("mal_id")]
    public long MalId { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = null!;

    [JsonPropertyName("about")]
    public string? About { get; set; }
}
