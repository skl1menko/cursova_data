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
            var buses = await _context.Buses.ToListAsync();
            if (buses == null || buses.Count == 0)
            {
                return NotFound("No buses found.");
            }

            return Ok(buses);
        }
    }
}
