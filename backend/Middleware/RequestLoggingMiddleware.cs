using System.Diagnostics;

namespace MER_zadatak.Middleware
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestLoggingMiddleware> _logger;


        public RequestLoggingMiddleware(
            RequestDelegate next, 
            ILogger<RequestLoggingMiddleware> logger) {
            _next = next;
            _logger = logger;
        }


        public async Task InvokeAsync(HttpContext context)
        {
            var timestamp = DateTime.UtcNow;

            var stopwatch = Stopwatch.StartNew();

            await _next(context);

            stopwatch.Stop();

            _logger.LogInformation(
                "Timestamp: {Timestamp}, Method: {Method}, Path: {Path}, StatusCode: {StatusCode}, ResponseTimeMs: {ResponseTime}",
                timestamp,
                context.Request.Method,
                context.Request.Path,
                context.Response.StatusCode,
                stopwatch.ElapsedMilliseconds
                );

        }

    }
}
