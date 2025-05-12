using Microsoft.EntityFrameworkCore;

public class BusManagementContext : DbContext
{
    public BusManagementContext(DbContextOptions<BusManagementContext> options)
        : base(options)
    {
    }

    public DbSet<Bus> Buses { get; set; }
    public DbSet<Driver> Drivers { get; set; }
    public DbSet<Schedule> Schedules { get; set; }
    public DbSet<Trip> Trips { get; set; }
    public DbSet<Load> Loads { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Route> Routes { get; set; }
    public DbSet<Stop> Stops { get; set; }

    // Конфігурація зв'язків
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

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

        modelBuilder.Entity<Route>()
            .HasOne(r => r.Bus)
            .WithMany(b => b.Routes)
            .HasForeignKey(r => r.BusId);

        modelBuilder.Entity<Stop>()
            .HasOne(s => s.Route)
            .WithMany(r => r.Stops)
            .HasForeignKey(s => s.RouteId);

    }
}
