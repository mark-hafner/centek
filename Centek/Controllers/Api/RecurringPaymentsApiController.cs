using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Centek.Data;
using Centek.Models;
using Centek.Filters;

namespace Centek.Controllers_Api
{
    [Route("api/v1/recPayments")]
    [ApiController]
    [ApiKeyAuth]
    public class RecurringPaymentsApiController : ControllerBase
    {
        private readonly CentekContext _context;

        public RecurringPaymentsApiController(CentekContext context)
        {
            _context = context;
        }

        // GET: api/RecurringPaymentsApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecurringPayment>>> GetRecurringPayment()
        {
            return await _context.RecurringPayment.ToListAsync();
        }

        // GET: api/RecurringPaymentsApi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RecurringPayment>> GetRecurringPayment(int id)
        {
            var recurringPayment = await _context.RecurringPayment.FindAsync(id);

            if (recurringPayment == null)
            {
                return NotFound();
            }

            return recurringPayment;
        }

        // PUT: api/RecurringPaymentsApi/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRecurringPayment(int id, RecurringPayment recurringPayment)
        {
            if (id != recurringPayment.ID)
            {
                return BadRequest();
            }

            _context.Entry(recurringPayment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RecurringPaymentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/RecurringPaymentsApi
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RecurringPayment>> PostRecurringPayment(RecurringPayment recurringPayment)
        {
            _context.RecurringPayment.Add(recurringPayment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRecurringPayment", new { id = recurringPayment.ID }, recurringPayment);
        }

        // DELETE: api/RecurringPaymentsApi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecurringPayment(int id)
        {
            var recurringPayment = await _context.RecurringPayment.FindAsync(id);
            if (recurringPayment == null)
            {
                return NotFound();
            }

            _context.RecurringPayment.Remove(recurringPayment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RecurringPaymentExists(int id)
        {
            return _context.RecurringPayment.Any(e => e.ID == id);
        }
    }
}
