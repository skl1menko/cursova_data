public class Route
{
    public int RouteId { get; set; }
    public string Name { get; set; }
    public float Distance { get; set; }

    public virtual ICollection<Schedule> Schedules { get; set; }
    public virtual ICollection<RouteStops> RouteStops { get; set; }
}
