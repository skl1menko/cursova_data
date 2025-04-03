public class Bus
{
    public int BusId { get; set; }
    public string Model { get; set; }
    public int Capacity { get; set; }
    public int Year { get; set; }

    public virtual ICollection<Schedule> Schedules { get; set; }
}
