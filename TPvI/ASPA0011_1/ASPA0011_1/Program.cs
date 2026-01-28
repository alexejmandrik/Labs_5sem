using ASPA0011_1.Logging;
using ASPA0011_1.Services;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddFile("Logs/app.log");

builder.Logging.AddFilter((category, level) =>
{
    if (!builder.Environment.IsDevelopment() && (level == LogLevel.Trace || level == LogLevel.Debug))
        return false;

    if (category.StartsWith("Microsoft") || category.StartsWith("System"))
        return level >= LogLevel.Error;
    return true;
});

builder.Services.AddSingleton<ChannelService>();
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (!File.Exists("appsettings.json"))
{
    var logger = app.Services.GetRequiredService<ILoggerFactory>().CreateLogger("Startup");
    logger.LogCritical("Файл appsettings.json отсутствует! Приложение не может быть запущено.");

    throw new FileNotFoundException("Отсутствует appsettings.json");
}

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
