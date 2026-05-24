using System.Net.Http.Json;
using AniRiseBackend.Contracts.Jikan;

namespace AniRiseBackend.Services;

public class AnimeGetService
{
    private readonly HttpClient _httpClient;
    private static readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);

    public AnimeGetService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    private AnimePreviewContract MapToPreviewContract(JikanAnimeData data)
    {
        return new AnimePreviewContract
        {
            Id = data.MalId,
            Title = data.Title,
            PosterUrl = data.Images?.Jpg?.ImageUrl,
            Type = data.Type,
            Year = data.Aired?.From?.Year,
            Episodes = data.Episodes,
            Synopsis = data.Synopsis,
            Genres = data.Genres.Select(g => g.Name).ToList(),
            Studios = data.Studios.Select(s => s.Name).ToList(),
            Score = data.Score
        };
    }

    public async Task<AnimePreviewContract?> GetAnimePreviewAsync(long id)
    {
        try
        {
            await _semaphore.WaitAsync();
            await Task.Delay(1200);
            var response = await _httpClient.GetAsync($"https://api.jikan.moe/v4/anime/{id}/full");
            Console.WriteLine($"Jikan anime preview response: {response.StatusCode}");
            response.EnsureSuccessStatusCode();
            var data = await response.Content.ReadFromJsonAsync<JikanAnimeResponse>();
            return data?.Data == null ? null : MapToPreviewContract(data.Data);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetAnimePreviewAsync: {ex.Message}");
            return null;
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public async Task<List<AnimePreviewContract>> GetPopularAnimeAsync(int limit = 10)
    {
        try
        {
            await _semaphore.WaitAsync();
            await Task.Delay(1200);
            var response = await _httpClient.GetAsync($"https://api.jikan.moe/v4/top/anime?limit={limit}");
            Console.WriteLine($"Jikan popular response: {response.StatusCode}");
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Jikan popular error content: {errorContent}");
                return new List<AnimePreviewContract>();
            }
            var data = await response.Content.ReadFromJsonAsync<JikanListResponse>();
            if (data?.Data == null) return new List<AnimePreviewContract>();
            return data.Data.Select(MapToPreviewContract).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetPopularAnimeAsync: {ex.Message}");
            return new List<AnimePreviewContract>();
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public async Task<List<AnimePreviewContract>> GetCurrentlyAiringAnimeAsync(int limit = 10)
    {
        try
        {
            await _semaphore.WaitAsync();
            await Task.Delay(1200);
            var response = await _httpClient.GetAsync($"https://api.jikan.moe/v4/seasons/now?limit={limit}");
            Console.WriteLine($"Jikan airing response: {response.StatusCode}");
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Jikan airing error content: {errorContent}");
                return new List<AnimePreviewContract>();
            }
            var data = await response.Content.ReadFromJsonAsync<JikanListResponse>();
            if (data?.Data == null) return new List<AnimePreviewContract>();
            return data.Data.Select(MapToPreviewContract).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetCurrentlyAiringAnimeAsync: {ex.Message}");
            return new List<AnimePreviewContract>();
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public async Task<List<AnimePreviewContract>> GetTopSeriesAsync(int limit = 10)
    {
        try
        {
            await _semaphore.WaitAsync();
            await Task.Delay(1200);
            var response = await _httpClient.GetAsync($"https://api.jikan.moe/v4/top/anime?type=tv&limit={limit}");
            Console.WriteLine($"Jikan top series response: {response.StatusCode}");
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Jikan top series error content: {errorContent}");
                return new List<AnimePreviewContract>();
            }
            var data = await response.Content.ReadFromJsonAsync<JikanListResponse>();
            if (data?.Data == null) return new List<AnimePreviewContract>();
            return data.Data.Select(MapToPreviewContract).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetTopSeriesAsync: {ex.Message}");
            return new List<AnimePreviewContract>();
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public async Task<List<AnimePreviewContract>> GetTopMoviesAsync(int limit = 10)
    {
        try
        {
            await _semaphore.WaitAsync();
            await Task.Delay(1200);
            var response = await _httpClient.GetAsync($"https://api.jikan.moe/v4/top/anime?type=movie&limit={limit}");
            Console.WriteLine($"Jikan top movies response: {response.StatusCode}");
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Jikan top movies error content: {errorContent}");
                return new List<AnimePreviewContract>();
            }
            var data = await response.Content.ReadFromJsonAsync<JikanListResponse>();
            if (data?.Data == null) return new List<AnimePreviewContract>();
            return data.Data.Select(MapToPreviewContract).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetTopMoviesAsync: {ex.Message}");
            return new List<AnimePreviewContract>();
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public async Task<List<AnimePreviewContract>> GetTopRatedAnimeAsync(int limit = 10)
    {
        try
        {
            await _semaphore.WaitAsync();
            await Task.Delay(1200);
            var response = await _httpClient.GetAsync($"https://api.jikan.moe/v4/top/anime?limit={limit}");
            Console.WriteLine($"Jikan top rated response: {response.StatusCode}");
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Jikan top rated error content: {errorContent}");
                return new List<AnimePreviewContract>();
            }
            var data = await response.Content.ReadFromJsonAsync<JikanListResponse>();
            if (data?.Data == null) return new List<AnimePreviewContract>();
            return data.Data.Select(MapToPreviewContract).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetTopRatedAnimeAsync: {ex.Message}");
            return new List<AnimePreviewContract>();
        }
        finally
        {
            _semaphore.Release();
        }
    }
}