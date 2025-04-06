// Controllers/LoadsController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class LoadsController : ControllerBase
{
    private readonly BusManagementContext _context;

    public LoadsController(BusManagementContext context)
    {
        _context = context;
    }

    // GET: api/Loads
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Load>>> GetLoads()
    {
        return await _context.Loads.ToListAsync();
    }

    // GET: api/Loads/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Load>> GetLoad(int id)
    {
        var load = await _context.Loads.FindAsync(id);

        if (load == null)
        {
            return NotFound();
        }

        return load;
    }

    // POST: api/Loads
    [HttpPost]
    public async Task<ActionResult<Load>> PostLoad(Load load)
    {
        _context.Loads.Add(load);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetLoad", new { id = load.LoadId }, load);
    }

    // PUT: api/Loads/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutLoad(int id, Load load)
    {
        if (id != load.LoadId)
        {
            return BadRequest();
        }

        _context.Entry(load).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Loads/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLoad(int id)
    {
        var load = await _context.Loads.FindAsync(id);
        if (load == null)
        {
            return NotFound();
        }

        _context.Loads.Remove(load);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
