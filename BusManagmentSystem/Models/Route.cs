public class Route
{
    public int RouteId { get; set; }
    public string RouteNumber { get; set; }
    public string? Description { get; set; }
    public int BusId { get; set; }

    public Bus Bus { get; set; }
    public List<Stop> Stops { get; set; }
}