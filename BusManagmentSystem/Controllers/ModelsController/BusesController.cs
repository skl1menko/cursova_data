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
        public async Task<ActionResult<object>> GetDetailedBusStatistics(int id)
        {
            var schedules = await _context.Schedules
                .Where(s => s.BusId == id)
                .Include(s => s.Trips)
                    .ThenInclude(t => t.Loads)
                .ToListAsync();

            if (!schedules.Any())
            {
                return NotFound($"No schedules found for bus with ID {id}.");
            }

            var trips = schedules.SelectMany(s => s.Trips).ToList();
            var totalLoads = trips.SelectMany(t => t.Loads).Count();

            var durations = trips
                .Where(t => t.ActualDeparture.HasValue && t.ActualArrival.HasValue)
                .Select(t => (t.ActualArrival.Value - t.ActualDeparture.Value).TotalMinutes)
                .ToList();

            var loadCounts = trips.Select(t => t.Loads.Count).ToList();

            var tripDates = trips
                .Where(t => t.ActualDeparture.HasValue)
                .Select(t => t.ActualDeparture.Value.Date)
                .Distinct()
                .ToList();

            var lastTrip = trips
                .Where(t => t.ActualDeparture.HasValue)
                .OrderByDescending(t => t.ActualDeparture)
                .FirstOrDefault();

            return Ok(new
            {
                BusId = id,
                ScheduleCount = schedules.Count,
                TripCount = trips.Count,
                LoadCount = totalLoads,
                AverageTripDurationMinutes = durations.Any() ? Math.Round(durations.Average(), 2) : 0,
                TotalTripDurationMinutes = durations.Sum(),
                UniqueTravelDays = tripDates.Count,
                LoadStats = new
                {
                    Min = loadCounts.Any() ? loadCounts.Min() : 0,
                    Max = loadCounts.Any() ? loadCounts.Max() : 0,
                    Average = loadCounts.Any() ? Math.Round(loadCounts.Average(), 2) : 0
                },
                LastTripTime = lastTrip?.ActualDeparture
            });
        }




    }
}
