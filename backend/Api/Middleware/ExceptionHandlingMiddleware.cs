using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Application.Common.Exceptions;

namespace Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");

            var (status, title) = ex switch
            {
                NotFoundException => ((int)HttpStatusCode.NotFound, "Recurso no encontrado"),
                BadRequestException => ((int)HttpStatusCode.BadRequest, "Solicitud inválida"),
                ExternalServiceException => ((int)HttpStatusCode.BadGateway, "Error en servicio externo"),
                _ => ((int)HttpStatusCode.InternalServerError, "Error interno")
            };

            context.Response.StatusCode = status;
            context.Response.ContentType = "application/json";

            var problem = new ProblemDetails
            {
                Status = status,
                Title = title,
                Detail = ex.Message,
                Instance = context.Request.Path
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(problem));
        }

    }
}
