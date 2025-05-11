// Controllers/DriversController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class DriversController : ControllerBase
{
    private readonly BusManagementContext _context;

    public DriversController(BusManagementContext context)
    {
        _context = context;
    }

    // GET: api/Drivers
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Driver>>> GetDrivers()
    {
        return await _context.Drivers
        .Include(d => d.Schedules)
        .ToListAsync();
    }

    // GET: api/Drivers/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Driver>> GetDriver(int id)
    {
        var driver = await _context.Drivers
        .Include(d => d.Schedules)
        .FirstOrDefaultAsync(d => d.DriverId == id);

        if (driver == null)
        {
            return NotFound();
        }

        return driver;
    }

    // POST: api/Drivers
    [HttpPost]
    public async Task<ActionResult<Driver>> PostDriver(Driver driver)
    {
        _context.Drivers.Add(driver);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetDriver", new { id = driver.DriverId }, driver);
    }

    // PUT: api/Drivers/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutDriver(int id, Driver driver)
    {
        if (id != driver.DriverId)
        {
            return BadRequest();
        }

        _context.Entry(driver).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Drivers/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDriver(int id)
    {
        var driver = await _context.Drivers.FindAsync(id);
        if (driver == null)
        {
            return NotFound();
        }

        _context.Drivers.Remove(driver);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/Drivers/5/Schedules
    [HttpGet("{id}/Schedules")]
    public async Task<ActionResult<IEnumerable<Schedule>>> GetDriverSchedules(int id)
    {
        var driver = await _context.Drivers
            .Include(d => d.Schedules)
            .FirstOrDefaultAsync(d => d.DriverId == id);

        if (driver == null)
        {
            return NotFound();
        }

        return Ok(driver.Schedules);
    }


}
