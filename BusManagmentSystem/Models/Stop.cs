public class Stop
{
    public int StopId { get; set; }
    public string StopName { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public int StopOrder { get; set; }

    public int RouteId { get; set; }
    public Route Route { get; set; }
}