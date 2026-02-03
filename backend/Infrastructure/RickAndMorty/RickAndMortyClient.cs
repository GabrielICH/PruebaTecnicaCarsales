using System.Net.Http.Json;
using Application.Characters.Clients;
using Application.Characters.Models;
using Infrastructure.RickAndMorty.Dtos;

namespace Infrastructure.RickAndMorty;

public class RickAndMortyClient : IRickAndMortyClient
{
    private readonly HttpClient _httpClient;

    public RickAndMortyClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<PagedResult<CharacterResult>> GetCharactersAsync(CharacterQuery query)
    {
      var parameters = new Dictionary<string, string?>
    {
        ["page"] = query.Page.ToString(),
        ["name"] = query.Name,
        ["status"] = query.Status,
        ["species"] = query.Species
    };

    var queryString = BuildQueryString(parameters);
    var url = string.IsNullOrEmpty(queryString)
        ? "character"
        : $"character?{queryString}";

    var response = await _httpClient.GetFromJsonAsync<RickAndMortyResponseDto>(url);

        var items = response?.Results.Select(c => new CharacterResult
        {
            Id = c.Id,
            Name = c.Name,
            Status = c.Status,
            Species = c.Species,
            Image = c.Image
        }).ToList() ?? [];

        return new PagedResult<CharacterResult>
        {
            Items = items,
            Page = query.Page,
            TotalPages = response?.Info.Pages ?? 0,
            TotalCount = response?.Info.Count ?? 0
        };
    }

    private static string BuildQueryString(Dictionary<string, string?> parameters)
    {
        var filtered = parameters
            .Where(p => !string.IsNullOrWhiteSpace(p.Value))
            .Select(p => $"{Uri.EscapeDataString(p.Key)}={Uri.EscapeDataString(p.Value!)}");

        return string.Join("&", filtered);
    }
}
