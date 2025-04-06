// Controllers/RoutesController.cs
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

    // GET: api/Routes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Route>>> GetRoutes()
    {
        return await _context.Routes.ToListAsync();
    }

    // GET: api/Routes/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Route>> GetRoute(int id)
    {
        var route = await _context.Routes.FindAsync(id);

        if (route == null)
        {
            return NotFound();
        }

        return route;
    }

    // POST: api/Routes
    [HttpPost]
    public async Task<ActionResult<Route>> PostRoute(Route route)
    {
        _context.Routes.Add(route);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetRoute", new { id = route.RouteId }, route);
    }

    // PUT: api/Routes/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutRoute(int id, Route route)
    {
        if (id != route.RouteId)
        {
            return BadRequest();
        }

        _context.Entry(route).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Routes/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRoute(int id)
    {
        var route = await _context.Routes.FindAsync(id);
        if (route == null)
        {
            return NotFound();
        }

        _context.Routes.Remove(route);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
