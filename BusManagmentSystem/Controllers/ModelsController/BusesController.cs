using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BusManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusesController : ControllerBase
    {
        private readonly BusManagementContext _context;

        public BusesController(BusManagementContext context)
        {
            _context = context;
        }

        // GET: api/Buses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bus>>> GetBuses()
        {
            // Перевірка, чи є записи в базі
            var buses = await _context.Buses
            .Include(b => b.Schedules)
            .ToListAsync();
            if (buses == null || buses.Count == 0)
            {
                return NotFound("No buses found.");
            }

            return Ok(buses);
        }

        // GET: api/Buses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Bus>> GetBus(int id)
        {
            var bus = await _context.Buses
            .Include(b => b.Schedules)
            .FirstOrDefaultAsync(b => b.BusId == id);

            if (bus == null)
            {
                return NotFound($"Bus with ID {id} not found.");
            }

            return Ok(bus);
        }

        //POST: api/Buses]
        [HttpPost]
        public async Task<ActionResult<Bus>> PostBus(Bus bus)
        {
            if (bus == null)
            {
                return BadRequest("Bus data is null.");
            }

            _context.Buses.Add(bus);
            await _context.SaveChangesAsync();

            // Создаем новый маршрут для автобуса
            var route = new Route
            {
                BusId = bus.BusId,
                RouteNumber = bus.BusId, // Используем ID автобуса как номер маршрута
                Description = $"Маршрут {bus.BusId} Черкаси"
            };

            _context.Routes.Add(route);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBus", new { id = bus.BusId }, bus);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutBus(int id, Bus bus)
        {
            if (id != bus.BusId)
            {
                return BadRequest("Bus ID mismatch.");
            }

            _context.Entry(bus).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Buses.Any(b => b.BusId == id))
                {
                    return NotFound($"Bus with ID {id} not found.");
                }
                else
                {
                    throw;
                }
            }

            return Ok(bus); // <-- тепер повертається об'єкт
        }


        // DELETE: api/Buses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBus(int id)
        {
            var bus = await _context.Buses.FindAsync(id);
            if (bus == null)
            {
                return NotFound($"Bus with ID {id} not found.");
            }

            _context.Buses.Remove(bus);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Buses/5/stats
        [HttpGet("{id}/stats")]
        public async Task<ActionResult> GetBusStats(int id)
        {
            var busStats = await _context.Buses
                .Where(b => b.BusId == id)
                .Include(b => b.Schedules)
                    .ThenInclude(s => s.Driver)
                .Include(b => b.Routes)
                    .ThenInclude(r => r.Stops)
                .Select(b => new
                {
                    BusId = b.BusId,
                    Routes = b.Routes.Select(r => new
                    {
                        RouteId = r.RouteId,
                        RouteNumber = r.RouteNumber,
                        StopCount = r.Stops.Count
                    }),
                    Schedules = b.Schedules.Select(s => new
                    {
                        ScheduleId = s.ScheduleId,
                        FirstDeparture = s.FirstDepartureTime,
                        LastDeparture = s.LastDepartureTime,
                        Driver = s.Driver != null ? new
                        {
                            DriverId = s.Driver.DriverId,
                            Name = s.Driver.Name,
                            License = s.Driver.License,
                            Experience = s.Driver.Experience
                        } : null
                    })
                })
                .FirstOrDefaultAsync();

            if (busStats == null)
            {
                return NotFound($"Bus with ID {id} not found.");
            }

            return Ok(busStats);
        }

        public class DriverAssignmentRequest
        {
            public int DriverId { get; set; }
            public string FirstDepartureTime { get; set; }
            public string LastDepartureTime { get; set; }
        }

        // POST: api/Buses/5/assign-driver
        [HttpPost("{busId}/assign-driver")]
        public async Task<IActionResult> AssignDriverToBus(int busId, [FromBody] DriverAssignmentRequest request)
        {
            if (request == null || request.DriverId <= 0)
            {
                return BadRequest("Invalid driver ID");
            }

            var bus = await _context.Buses
                .Include(b => b.Schedules)
                .FirstOrDefaultAsync(b => b.BusId == busId);

            if (bus == null)
            {
                return NotFound($"Bus with ID {busId} not found.");
            }

            var driver = await _context.Drivers
                .Include(d => d.Schedules)
                .FirstOrDefaultAsync(d => d.DriverId == request.DriverId);

            if (driver == null)
            {
                return NotFound($"Driver with ID {request.DriverId} not found.");
            }

            // Check if the bus already has an active driver
            var existingBusSchedule = await _context.Schedules
                .FirstOrDefaultAsync(s => s.BusId == busId);

            if (existingBusSchedule != null)
            {
                return BadRequest("This bus already has a driver assigned. Please remove the current driver before assigning a new one.");
            }

            // Check if the driver is already assigned to another bus
            var existingDriverSchedule = await _context.Schedules
                .FirstOrDefaultAsync(s => s.DriverId == request.DriverId);

            if (existingDriverSchedule != null)
            {
                return BadRequest("This driver is already assigned to another bus. Please remove the driver from their current bus before assigning to a new one.");
            }

            // Create a new schedule for the driver-bus assignment
            var schedule = new Schedule
            {
                ScheduleId = busId,
                BusId = busId,
                DriverId = request.DriverId,
                FirstDepartureTime = request.FirstDepartureTime,
                LastDepartureTime = request.LastDepartureTime 
            };

            _context.Schedules.Add(schedule);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Driver successfully assigned to bus", schedule });
        }

        // DELETE: api/Buses/5/remove-driver
        [HttpDelete("{busId}/remove-driver")]
        public async Task<IActionResult> RemoveDriverFromBus(int busId)
        {
            var bus = await _context.Buses
                .Include(b => b.Schedules)
                .FirstOrDefaultAsync(b => b.BusId == busId);

            if (bus == null)
            {
                return NotFound($"Bus with ID {busId} not found.");
            }

            var schedule = await _context.Schedules
                .FirstOrDefaultAsync(s => s.BusId == busId);

            if (schedule == null)
            {
                return BadRequest("This bus doesn't have any driver assigned.");
            }

            _context.Schedules.Remove(schedule);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Driver successfully removed from bus" });
        }
    }
}
