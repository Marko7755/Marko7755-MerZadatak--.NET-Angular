using MER_zadatak.Data;
using MER_zadatak.Middleware;
using MER_zadatak.Models;
using MER_zadatak.Services;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options =>
      options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ICustomerService, CustomerService>();

var app = builder.Build();

app.UseCors("AngularFrontend");

app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();


using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    var stopwatch = Stopwatch.StartNew();
    
    await CustomerService.SeedCustomersAsync(context);

    stopwatch.Stop();

    Console.WriteLine($"Seed completed in {stopwatch.Elapsed.TotalSeconds} seconds");
}



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
