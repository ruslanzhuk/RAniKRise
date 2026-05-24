using AniRiseBackend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using AniRiseBackend.Services;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.OpenApi.Models;
using AniRiseBackend.Swagger;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using AniRiseBackend.Services.ML;
using Microsoft.AspNetCore.Http.Features;
using System.Security.Claims;


var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://0.0.0.0:5000");
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "AniRise API",
        Version = "v1"
    });
    c.OperationFilter<FileUploadOperationFilter>();
    c.OperationFilter<SwaggerAuthOperationFilter>();

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Enter the token in the format: Bearer {your_token}",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>  
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddHttpClient();

builder.Services.AddScoped<AdminAuthService>();
builder.Services.AddScoped<IAdminCommentService, AdminCommentService>();
builder.Services.AddScoped<AnimeGetService>();
builder.Services.AddScoped<AnimeImportService>();
builder.Services.AddScoped<AnimeService>();
builder.Services.AddScoped<AuthorService>();
builder.Services.AddScoped<CharacterService>();
builder.Services.AddScoped<ClubPostService>();
builder.Services.AddScoped<ClubPostReactionService>();
builder.Services.AddScoped<ClubService>();
builder.Services.AddScoped<CollectionService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<FriendshipService>();
builder.Services.AddScoped<GenreService>(); 
builder.Services.AddScoped<IHomeAnnouncementService, HomeAnnouncementService>();
builder.Services.AddScoped<IMediaService, MediaService>();
builder.Services.AddScoped<INewsService, NewsService>();
builder.Services.AddScoped<NotificationService>();
builder.Services.AddScoped<IPostService, PostService>();
builder.Services.AddScoped<SearchService>();
builder.Services.AddScoped<StudioService>();
builder.Services.AddScoped<SupportService>();
builder.Services.AddScoped<IUserAnimePublicService, UserAnimePublicService>();
builder.Services.AddScoped<IUserAnimeStatusService, UserAnimeStatusService>();
builder.Services.AddScoped<UserService>();

builder.Services.AddSingleton<CloudinaryService>();


builder.Services.AddHttpClient<IDetectionClient, DetectionClient>(client =>
{
    client.BaseAddress = new Uri(
        builder.Configuration["DetectionApi:BaseUrl"]
        ?? "http://anirise_detection_api:8081"
    );
    client.Timeout = TimeSpan.FromSeconds(60);
});


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 200_000_000; // 200 MB
});

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBodySize = 200_000_000; // 200 MB
});

var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key is missing!");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(jwtKey)),
            RoleClaimType = ClaimTypes.Role
        };
    });

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var dbContext = services.GetRequiredService<AppDbContext>();

    const int maxRetries = 10;
    var retryDelay = TimeSpan.FromSeconds(2);

    for (int retry = 0; retry < maxRetries; retry++)
    {
        try
        {
            logger.LogInformation("Attempting to apply migrations...");
            dbContext.Database.Migrate();
            logger.LogInformation("Migrations applied.");
            
            // --- Seed WatchStatuses ---
            DbSeeder.SeedWatchStatuses(dbContext);
            logger.LogInformation("WatchStatuses seeded.");

            break;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Could not connect to database. Retrying in {Delay} seconds...", retryDelay.TotalSeconds);
            if (retry == maxRetries - 1)
            {
                logger.LogError("Exceeded maximum retry attempts to connect to database. Application will exit.");
                throw;
            }
            Thread.Sleep(retryDelay);
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "AniRise API V1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowFrontend");
// app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
Console.WriteLine("Hellow World!");
