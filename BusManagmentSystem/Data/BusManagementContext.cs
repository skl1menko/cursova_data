using Microsoft.EntityFrameworkCore;

public class BusManagementContext : DbContext
{
    public BusManagementContext(DbContextOptions<BusManagementContext> options)
        : base(options)
    {
    }

    // Таблиці
    public DbSet<Bus> Buses { get; set; }
    public DbSet<Driver> Drivers { get; set; }
    public DbSet<Route> Routes { get; set; }
    public DbSet<RouteStops> RouteStops { get; set; }
    public DbSet<Stop> Stops { get; set; }
    public DbSet<Schedule> Schedules { get; set; }
    public DbSet<Trip> Trips { get; set; }
    public DbSet<Load> Loads { get; set; }
    public DbSet<User> Users { get; set; }

    // Конфігурація зв'язків
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Зв'язки між таблицями
        modelBuilder.Entity<RouteStops>()
            .HasKey(rs => new { rs.RouteId, rs.StopId });

        modelBuilder.Entity<RouteStops>()
            .HasOne(rs => rs.Route)
            .WithMany(r => r.RouteStops)
            .HasForeignKey(rs => rs.RouteId);

        modelBuilder.Entity<RouteStops>()
            .HasOne(rs => rs.Stop)
            .WithMany(s => s.RouteStops)
            .HasForeignKey(rs => rs.StopId);

        // Зв'язки між іншими таблицями
        modelBuilder.Entity<Schedule>()
            .HasOne(s => s.Route)
            .WithMany(r => r.Schedules)
            .HasForeignKey(s => s.RouteId);

        modelBuilder.Entity<Schedule>()
            .HasOne(s => s.Bus)
            .WithMany(b => b.Schedules)
            .HasForeignKey(s => s.BusId);

        modelBuilder.Entity<Schedule>()
            .HasOne(s => s.Driver)
            .WithMany(d => d.Schedules)
            .HasForeignKey(s => s.DriverId);

        modelBuilder.Entity<Trip>()
            .HasOne(t => t.Schedule)
            .WithMany(s => s.Trips)
            .HasForeignKey(t => t.ScheduleId);

        modelBuilder.Entity<Load>()
            .HasOne(l => l.Trip)
            .WithMany(t => t.Loads)
            .HasForeignKey(l => l.TripId);

        modelBuilder.Entity<Load>()
            .HasOne(l => l.Stop)
            .WithMany(s => s.Loads)
            .HasForeignKey(l => l.StopId);

    }
}
