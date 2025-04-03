using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Додаємо контекст бази даних з рядком підключення з appsettings.json
builder.Services.AddDbContext<BusManagementContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BusManagementDb"))
);

// Додаємо необхідні сервіси для контролерів
builder.Services.AddControllers();

// Інші сервіси, якщо потрібно, можна додавати тут

var app = builder.Build();

// Налаштовуємо маршрути для контролерів
app.MapControllers();

// Запуск веб-додатка
app.Run();
