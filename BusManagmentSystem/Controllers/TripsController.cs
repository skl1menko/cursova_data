// Controllers/TripsController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class TripsController : ControllerBase
{
    private readonly BusManagementContext _context;

    public TripsController(BusManagementContext context)
    {
        _context = context;
    }

    // GET: api/Trips
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Trip>>> GetTrips()
    {
        return await _context.Trips.ToListAsync();
    }

    // GET: api/Trips/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Trip>> GetTrip(int id)
    {
        var trip = await _context.Trips.FindAsync(id);

        if (trip == null)
        {
            return NotFound();
        }

        return trip;
    }

    // POST: api/Trips
    [HttpPost]
    public async Task<ActionResult<Trip>> PostTrip(Trip trip)
    {
        _context.Trips.Add(trip);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetTrip", new { id = trip.TripId }, trip);
    }

    // PUT: api/Trips/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTrip(int id, Trip trip)
    {
        if (id != trip.TripId)
        {
            return BadRequest();
        }

        _context.Entry(trip).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Trips/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTrip(int id)
    {
        var trip = await _context.Trips.FindAsync(id);
        if (trip == null)
        {
            return NotFound();
        }

        _context.Trips.Remove(trip);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
