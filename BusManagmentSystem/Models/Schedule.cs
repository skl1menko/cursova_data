public class Schedule
{
    public int ScheduleId { get; set; }
    public int BusId { get; set; }
    public int DriverId { get; set; }

    // Время первого и последнего отправления
    public string FirstDepartureTime { get; set; }
    public string LastDepartureTime { get; set; }

    public virtual Bus Bus { get; set; }
    public virtual Driver Driver { get; set; }
}
