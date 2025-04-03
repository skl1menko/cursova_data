public class Load
{
    public int LoadId { get; set; }
    public int TripId { get; set; }
    public int StopId { get; set; }
    public int Boarding { get; set; }
    public int Alighting { get; set; }

    public virtual Trip Trip { get; set; }
    public virtual Stop Stop { get; set; }
}
