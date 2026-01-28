using BSTU.Results.Collection;
using BSTU.Results.Authenticate;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("cookieAuth", new OpenApiSecurityScheme
    {
        Name = "Cookie",
        Type = SecuritySchemeType.ApiKey,
        In = ParameterLocation.Cookie,
        Description = "Cookie для аутентификации"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme { Name = "cookieAuth", Type = SecuritySchemeType.ApiKey, In = ParameterLocation.Cookie },
            new string[] { }
        }
    });
});

builder.Services.AddTransient<IResultsService, FileResultsService>();
builder.Services.AddScoped<IAuthenticateService, AuthenticateService>();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/api/Results/SignIn";
        options.LogoutPath = "/api/Results/SignOut";
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ReaderPolicy", policy => policy.RequireRole("READER", "WRITER"));
    options.AddPolicy("WriterPolicy", policy => policy.RequireRole("WRITER"));
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
