// Controllers/RouteStopsController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class RouteStopsController : ControllerBase
{
    private readonly BusManagementContext _context;

    public RouteStopsController(BusManagementContext context)
    {
        _context = context;
    }

    // GET: api/RouteStops
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RouteStops>>> GetRouteStops()
    {
        return await _context.RouteStops.ToListAsync();
    }

    // GET: api/RouteStops/5
    [HttpGet("{id}")]
    public async Task<ActionResult<RouteStops>> GetRouteStop(int id)
    {
        var routeStop = await _context.RouteStops.FindAsync(id);

        if (routeStop == null)
        {
            return NotFound();
        }

        return routeStop;
    }

    // POST: api/RouteStops
    [HttpPost]
    public async Task<ActionResult<RouteStops>> PostRouteStop(RouteStops routeStop)
    {
        _context.RouteStops.Add(routeStop);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetRouteStop", new { id = routeStop.RouteId }, routeStop);
    }

    // PUT: api/RouteStops/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutRouteStop(int id, RouteStops routeStop)
    {
        if (id != routeStop.RouteId)
        {
            return BadRequest();
        }

        _context.Entry(routeStop).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/RouteStops/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRouteStop(int id)
    {
        var routeStop = await _context.RouteStops.FindAsync(id);
        if (routeStop == null)
        {
            return NotFound();
        }

        _context.RouteStops.Remove(routeStop);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
