public class Schedule
{
    public int ScheduleId { get; set; }
    public int RouteId { get; set; }
    public int BusId { get; set; }
    public int DriverId { get; set; }
    public DateTime DepartureTime { get; set; }

    public virtual Route Route { get; set; }
    public virtual Bus Bus { get; set; }
    public virtual Driver Driver { get; set; }
    public virtual ICollection<Trip> Trips { get; set; }
}
