namespace BusManagementSystem.Models
{
    public class DriverAssignmentRequest
    {
        public int DriverId { get; set; }
        public string FirstDepartureTime { get; set; }
        public string LastDepartureTime { get; set; }
    }
} 