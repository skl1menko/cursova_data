using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class RoutesController : ControllerBase
{
    private readonly BusManagementContext _context;

    public RoutesController(BusManagementContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Route>>> GetRoutes()
    {
        return await _context.Routes.Include(r => r.Stops).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Route>> GetRoute(int id)
    {
        var route = await _context.Routes
            .Include(r => r.Stops)
            .FirstOrDefaultAsync(r => r.RouteId == id);

        if (route == null)
        {
            return NotFound();
        }

        return route;
    }

    [HttpPost]
    public async Task<ActionResult<Route>> PostRoute(Route route)
    {
        _context.Routes.Add(route);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRoute), new { id = route.RouteId }, route);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutRoute(int id, Route route)
    {
        if (id != route.RouteId)
            return BadRequest();

        _context.Entry(route).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRoute(int id)
    {
        var route = await _context.Routes.FindAsync(id);
        if (route == null)
            return NotFound();

        _context.Routes.Remove(route);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
