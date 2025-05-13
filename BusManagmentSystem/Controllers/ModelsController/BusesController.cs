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
        public async Task<ActionResult> GetBusStats(int id)
        {
            var busStats = await _context.Buses
                .Where(b => b.BusId == id)
                .Include(b => b.Schedules)
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
                        LastDeparture = s.LastDepartureTime
                    })
                })
                .FirstOrDefaultAsync();

            if (busStats == null)
            {
                return NotFound($"Bus with ID {id} not found.");
            }

            return Ok(busStats);
        }


    }
}
