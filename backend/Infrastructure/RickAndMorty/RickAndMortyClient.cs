using System.Net;
using System.Net.Http.Json;
using Application.Common.Exceptions;
using Application.Characters.Clients;
using Application.Characters.Models;
using Infrastructure.RickAndMorty.Dtos;
using Application.Episodes.Models;

namespace Infrastructure.RickAndMorty;

public class RickAndMortyClient : IRickAndMortyClient
{
    private readonly HttpClient _httpClient;

    public RickAndMortyClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }
  //Busqueda de Personaje
    public async Task<PagedResult<CharacterResult>> GetCharactersAsync(CharacterQuery query)
    {
      var parameters = new Dictionary<string, string?>
        {
            ["page"] = (query.Page <= 0 ? 1 : query.Page).ToString(),
            ["name"] = query.Name,
            ["status"] = query.Status,
            ["species"] = query.Species
        };

        var queryString = BuildQueryString(parameters);
        var url = string.IsNullOrEmpty(queryString) ? "character" : $"character?{queryString}";

        var httpResponse = await _httpClient.GetAsync(url);

        if (httpResponse.StatusCode == HttpStatusCode.NotFound)
        {
            throw new NotFoundException("No se encontraron personajes con los filtros indicados.");
        }

        if (httpResponse.StatusCode == HttpStatusCode.BadRequest)
        {
            throw new BadRequestException("Parámetros inválidos para la consulta de personajes.");
        }

        if (!httpResponse.IsSuccessStatusCode)
        {
            throw new ExternalServiceException(
                $"Error consultando Rick & Morty API. Status: {(int)httpResponse.StatusCode}"
            );
        }

        var response = await httpResponse.Content
            .ReadFromJsonAsync<RickAndMortyResponseDto>();


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
            Page = query.Page <= 0 ? 1 : query.Page,
            TotalPages = response?.Info.Pages ?? 0,
            TotalCount = response?.Info.Count ?? 0
        };
    }
// Busqueda de episodios
    public async Task<PagedResult<EpisodeResult>> GetEpisodesAsync(EpisodeQuery query)
    {
        var parameters = new Dictionary<string, string?>
        {
            ["page"] = (query.Page <= 0 ? 1 : query.Page).ToString(),
            ["name"] = query.Name
        };

        var queryString = BuildQueryString(parameters);
        var url = string.IsNullOrEmpty(queryString) ? "episode" : $"episode?{queryString}";

        var httpResponse = await _httpClient.GetAsync(url);

        if (httpResponse.StatusCode == HttpStatusCode.NotFound)
            throw new NotFoundException("No se encontraron episodios con los filtros indicados.");

        if (httpResponse.StatusCode == HttpStatusCode.BadRequest)
            throw new BadRequestException("Parámetros inválidos para la consulta de episodios.");

        if (!httpResponse.IsSuccessStatusCode)
            throw new ExternalServiceException($"Error consultando Rick & Morty API. Status: {(int)httpResponse.StatusCode}");

        var response = await httpResponse.Content.ReadFromJsonAsync<RickAndMortyEpisodeResponseDto>();
        if (response is null)
            throw new ExternalServiceException("Respuesta inválida del servicio externo.");

        var items = response.Results.Select(e => new EpisodeResult
        {
            Id = e.Id,
            Name = e.Name,
            AirDate = e.Air_Date,
            EpisodeCode = e.Episode
        }).ToList();

        return new PagedResult<EpisodeResult>
        {
            Items = items,
            Page = query.Page <= 0 ? 1 : query.Page,
            TotalPages = response.Info.Pages,
            TotalCount = response.Info.Count
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
