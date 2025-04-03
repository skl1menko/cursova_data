// Controllers/StopsController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class StopsController : ControllerBase
{
    private readonly BusManagementContext _context;

    public StopsController(BusManagementContext context)
    {
        _context = context;
    }

    // GET: api/Stops
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Stop>>> GetStops()
    {
        return await _context.Stops.ToListAsync();
    }

    // GET: api/Stops/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Stop>> GetStop(int id)
    {
        var stop = await _context.Stops.FindAsync(id);

        if (stop == null)
        {
            return NotFound();
        }

        return stop;
    }

    // POST: api/Stops
    [HttpPost]
    public async Task<ActionResult<Stop>> PostStop(Stop stop)
    {
        _context.Stops.Add(stop);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetStop", new { id = stop.StopId }, stop);
    }

    // PUT: api/Stops/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutStop(int id, Stop stop)
    {
        if (id != stop.StopId)
        {
            return BadRequest();
        }

        _context.Entry(stop).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Stops/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStop(int id)
    {
        var stop = await _context.Stops.FindAsync(id);
        if (stop == null)
        {
            return NotFound();
        }

        _context.Stops.Remove(stop);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
