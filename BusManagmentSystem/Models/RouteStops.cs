public class RouteStops
{
    public int RouteId { get; set; }
    public int StopId { get; set; }
    public int Sequence { get; set; }

    public virtual Route Route { get; set; }
    public virtual Stop Stop { get; set; }
}