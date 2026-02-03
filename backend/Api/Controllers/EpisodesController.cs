using Application.Episodes;
using Application.Episodes.Models;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/episodes")]
public class EpisodesController : ControllerBase
{
    private readonly GetEpisodesService _service;

    public EpisodesController(GetEpisodesService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] EpisodeQuery query)
    {
        if (query.Page <= 0) query.Page = 1;

        var result = await _service.ExecuteAsync(query);
        return Ok(result);
    }
}
