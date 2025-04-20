using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using JWTRefreshTokenInDotNet6.Models;
using JWTRefreshTokenInDotNet6.Services;
using JWTRefreshTokenInDotNet6.Settings;
var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<JWT>(builder.Configuration.GetSection("JWT"));
builder.Services.AddControllers(); // ضروري عشان يشتغل الـ Controllers
builder.Services.AddEndpointsApiExplorer(); // عشان Swagger يشتغل
builder.Services.AddSwaggerGen(); // توليد Swagger UI

// 2. Database context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. Identity settings
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddScoped<IAuthService, AuthService>();

// 6. لو محتاجة CORS (اختياري حسب المشروع)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

// ✅ إنشاء الرولز USER و ADMIN لو مش موجودين
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    string[] roles = new[] { "USER", "ADMIN" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}

// 7. Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseCors("AllowAll"); // في حالة إنك محتاجة CORS

app.UseAuthentication(); // ✅ لازم يكون قبل Authorization
app.UseAuthorization();

// تأكد إنك تستخدم ملفات Static من wwwroot
app.UseStaticFiles();

app.MapFallbackToFile("index.html"); // لو رابط مش موجود، هيرجع لـ index.html بتاع React

app.MapControllers();

app.Run();
