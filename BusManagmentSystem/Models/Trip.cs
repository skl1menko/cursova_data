public class Trip
{
    public int TripId { get; set; }
    public int ScheduleId { get; set; }
    public DateTime? ActualDeparture { get; set; }
    public DateTime? ActualArrival { get; set; }
}