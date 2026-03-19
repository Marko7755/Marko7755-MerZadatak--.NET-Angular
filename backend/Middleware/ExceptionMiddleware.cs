using MER_zadatak.Exceptions;
using System.Text.Json;

namespace MER_zadatak.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;


        public ExceptionMiddleware(
            RequestDelegate next,
            ILogger<ExceptionMiddleware> logger)
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
            catch (Exception ex) {
                _logger.LogError(ex, "Unhandled exception occured. Path: {Path}, Method: {Method}", context.Request.Path, context.Request.Method);
                await HandleExceptionAsync(context, ex);
            }
        }


        private static async Task HandleExceptionAsync(HttpContext context, Exception ex) {
            context.Response.ContentType = "application/json";

            var statusCode = ex switch
            {
                DuplicateCustomerException => StatusCodes.Status409Conflict,
                CustomerNotFoundException => StatusCodes.Status404NotFound,
                ArgumentException => StatusCodes.Status400BadRequest,
                _ => StatusCodes.Status500InternalServerError
            };

            context.Response.StatusCode = statusCode;

            var response = new
            {
                statusCode,
                message = ex.Message
            };

            var json = JsonSerializer.Serialize(response);

            await context.Response.WriteAsync(json);


        }


    }
}
