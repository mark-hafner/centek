using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Centek.Data;
using Centek.Filters;
using Centek.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;

namespace Centek.Controllers_Api
{
    [Route("api/v1/payments")]
    [ApiController]
    [ApiKeyAuth]
    public class PaymentsApiController : ControllerBase
    {
        private readonly CentekContext _context;

        public PaymentsApiController(CentekContext context)
        {
            _context = context;
        }

        // GET: api/PaymentsApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
        {
            var userId = HttpContext.Request.Headers["UserId"].ToString();
            var userAccountIds = await _context
                .Accounts.Where(a => a.UserId == userId)
                .Select(u => u.ID)
                .ToListAsync();

            var allPayments = new List<Payment>();

            // NORMAL PAYMENTS
            var userPayments = await _context.Payments.Where(p => userAccountIds.Contains(p.AccountId.Value)).ToListAsync();
            allPayments.AddRange(userPayments);
            // RECURING PAYMENTS
            var recPayments = await _context
                .RecurringPayment.Where(r =>
                    r.AccountId.HasValue
                    && userAccountIds.Contains(r.AccountId.Value)
                    && r.StartDate.HasValue
                )
                .ToListAsync();

            DateTime fromDate = recPayments.Count != 0 ? recPayments.Min(x => x.StartDate!.Value) : DateTime.Today;
            var maxRecPaymentId = userPayments.Max(x => x.ID);

            DateTime today = DateTime.Today;
            DateTime toDate = new(
                today.Year,
                today.Month,
                DateTime.DaysInMonth(today.Year, today.Month)
            );
            var recPaymentId = 0;

            foreach (var recurringPayment in recPayments)
            {
                var frequency = recurringPayment.RecFrequency;
                var interval = recurringPayment.RecInterval;
                DateTime startDate = recurringPayment.StartDate.Value;
                DateTime endDate = recurringPayment.EndDate ?? DateTime.MaxValue;
                DateTime date = startDate;
                var newId = recurringPayment.ID - recPaymentId;

                while (date <= toDate && date < endDate)
                {
                    if (date >= fromDate)
                    {
                        allPayments.Add(
                            new Payment
                            {
                                ID = newId,
                                Name = recurringPayment.Name,
                                Note = recurringPayment.Note,
                                Type = recurringPayment.Type,
                                Amount = recurringPayment.Amount,
                                Date = date,
                                AccountId = recurringPayment.AccountId,
                                MainCategoryId = recurringPayment.MainCategoryId,
                                SubCategoryId = recurringPayment.SubCategoryId,
                                Account = recurringPayment.Account,
                                MainCategory = recurringPayment.MainCategory,
                                SubCategory = recurringPayment.SubCategory,
                            }
                        );
                    }

                    date = frequency switch
                    {
                        RecurringPayment.Frequency.Daily => date.AddDays((double)interval),
                        RecurringPayment.Frequency.Weekly => date.AddDays((double)interval * 7),
                        RecurringPayment.Frequency.Monthly => date.AddMonths((int)interval),
                        RecurringPayment.Frequency.Yearly => date.AddYears((int)interval),
                        _ => throw new InvalidOperationException(),
                    };
                }
            }

            allPayments = allPayments.OrderByDescending(p => p.Date).ToList();
            return Ok(allPayments);
        }

        // GET: api/PaymentsApi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);

            if (payment == null)
            {
                return NotFound();
            }

            return payment;
        }

        // PUT: api/PaymentsApi/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayment(int id, Payment payment)
        {
            if (id != payment.ID)
            {
                return BadRequest();
            }

            _context.Entry(payment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentExists(id))
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

        // POST: api/PaymentsApi
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("createPayment")]
        public async Task<ActionResult<Payment>> PostPayment(
            [FromBody] PaymentCreateRequest request
        )
        {
            var payment = new Payment
            {
                Name = request.Name,
                Note = request.Note,
                Type = request.Type,
                Amount = request.Amount,
                Date = request.Date,
                AccountId = request.AccountId,
                MainCategoryId = request.MainCategoryId > -1 ? request.MainCategoryId : null,
                SubCategoryId = request.SubCategoryId > -1 ? request.SubCategoryId : null,
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPayment", new { id = payment.ID }, payment);
        }

        // DELETE: api/PaymentsApi/5
        [HttpDelete("deletePayment/{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
            {
                return NotFound();
            }

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool PaymentExists(int id)
        {
            return _context.Payments.Any(e => e.ID == id);
        }
    }
}
