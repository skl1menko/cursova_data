public class Trip
{
    public int TripId { get; set; }
    public int ScheduleId { get; set; }
    public DateTime? ActualDeparture { get; set; }
    public DateTime? ActualArrival { get; set; }

    public virtual Schedule Schedule { get; set; }
    public virtual ICollection<Load> Loads { get; set; }
}
