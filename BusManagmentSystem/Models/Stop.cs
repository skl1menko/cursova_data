public class Stop
{
    public int StopId { get; set; }
    public string Name { get; set; }

    public virtual ICollection<RouteStops> RouteStops { get; set; }
    public virtual ICollection<Load> Loads { get; set; }
}
