public class Bus
{
    public int BusId { get; set; }
    public string Model { get; set; }
    public int Capacity { get; set; }
    public int Year { get; set; }

    // Навігаційне властивість для маршрутів
    public virtual ICollection<Route> Routes { get; set; }

    // Навігаційне властивість для розкладів
    public virtual ICollection<Schedule> Schedules { get; set; }
}
