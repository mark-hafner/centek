using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Centek.Data;
using Centek.Filters;
using Centek.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Centek.Controllers_Api
{
    [Route("api/v1/stats")]
    [ApiController]
    [ApiKeyAuth]
    public class StatsApiController : ControllerBase
    {
        private readonly CentekContext _context;
        private readonly UserManager<User> _userManager;

        public StatsApiController(CentekContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetStats(
            [FromQuery] List<int?>? accountIds,
            [FromQuery] List<int?>? mainCategoryIds,
            [FromQuery] List<int?>? subCategoryIds,
            [FromQuery] bool? type,
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate //,
        // [FromQuery] string userId
        )
        {
            var userId = HttpContext.Request.Headers["UserId"].ToString();
            if (userId == null)
                BadRequest(new { statusText = "Missing UserId" });

            var defaultFrom = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);
            var defaultTo = DateTime.Today;

            fromDate ??= defaultFrom;
            toDate ??= defaultTo;
            toDate = toDate.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59);

            // var user = await _userManager.GetUserAsync(User);
            var user = await _userManager.FindByIdAsync(userId);

            var paymentsQuery = _context
                .Payments.Include(p => p.Account)
                .Include(p => p.MainCategory)
                .Include(p => p.SubCategory)
                .Where(p => p.Account.UserId == user.Id)
                .AsQueryable();

            var recPaymentsQuery = _context
                .RecurringPayment.Include(p => p.Account)
                .Include(p => p.MainCategory)
                .Include(p => p.SubCategory)
                .Where(p => p.Account.UserId == user.Id)
                .AsQueryable();

            if (accountIds?.Any() == true)
            {
                paymentsQuery = paymentsQuery.Where(p => accountIds.Contains(p.AccountId));
                recPaymentsQuery = recPaymentsQuery.Where(p => accountIds.Contains(p.AccountId));
            }

            if (mainCategoryIds?.Any() == true)
            {
                paymentsQuery = paymentsQuery.Where(p =>
                    mainCategoryIds.Contains(p.MainCategoryId)
                );
                recPaymentsQuery = recPaymentsQuery.Where(p =>
                    mainCategoryIds.Contains(p.MainCategoryId)
                );
            }

            if (subCategoryIds?.Any() == true)
            {
                paymentsQuery = paymentsQuery.Where(p => subCategoryIds.Contains(p.SubCategoryId));
                recPaymentsQuery = recPaymentsQuery.Where(p =>
                    subCategoryIds.Contains(p.SubCategoryId)
                );
            }

            if (type.HasValue)
            {
                paymentsQuery = paymentsQuery.Where(p => p.Type == type);
                recPaymentsQuery = recPaymentsQuery.Where(p => p.Type == type);
            }

            if (fromDate.HasValue)
            {
                paymentsQuery = paymentsQuery.Where(p => p.Date >= fromDate);
                recPaymentsQuery = recPaymentsQuery.Where(p =>
                    !p.EndDate.HasValue || p.EndDate >= fromDate
                );
            }

            if (toDate.HasValue)
            {
                paymentsQuery = paymentsQuery.Where(p => p.Date <= toDate);
                recPaymentsQuery = recPaymentsQuery.Where(p => p.StartDate <= toDate);
            }

            var payments = await paymentsQuery.ToListAsync();
            var recPayments = await recPaymentsQuery.ToListAsync();

            foreach (var recurringPayment in recPayments)
            {
                var calculatedPayments = new List<Payment>();
                var frequency = recurringPayment.RecFrequency;
                var interval = recurringPayment.RecInterval;
                DateTime startDate = recurringPayment.StartDate.Value;
                DateTime endDate = recurringPayment.EndDate ?? DateTime.MaxValue;
                DateTime date = startDate;

                while (date <= toDate)
                {
                    if (date >= endDate)
                        break;
                    if (date >= fromDate)
                    {
                        calculatedPayments.Add(
                            new Payment
                            {
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

                    switch (frequency)
                    {
                        case RecurringPayment.Frequency.Daily:
                            date = date.AddDays((double)interval);
                            break;

                        case RecurringPayment.Frequency.Weekly:
                            date = date.AddDays((double)(interval * 7));
                            break;

                        case RecurringPayment.Frequency.Monthly:
                            date = date.AddMonths((int)interval);
                            break;

                        case RecurringPayment.Frequency.Yearly:
                            date = date.AddYears((int)interval);
                            break;
                    }
                }

                payments.AddRange(calculatedPayments);
            }

            payments = payments.OrderByDescending(p => p.Date).ToList();
            var total = payments.Sum(p => p.Type ? p.Amount : -p.Amount);

            var accounts = await _context
                .Accounts.Where(a => a.UserId == user.Id && a.Payments.Any())
                .ToListAsync();
            var mainCategories = await _context
                .MainCategories.Where(c => c.UserId == user.Id && c.Payments.Any())
                .ToListAsync();
            var subCategories = await _context
                .SubCategories.Where(sc => sc.MainCategory.UserId == user.Id && sc.Payments.Any())
                .Include(sc => sc.MainCategory)
                .ToListAsync();

            // Vrni JSON
            return Ok(
                new[]
                {
                    new
                    {
                        Total = total,
                        Payments = payments.Select(p => new
                        {
                            p.ID,
                            p.Name,
                            p.Amount,
                            p.Type,
                            p.Date,

                            Account = p.Account == null
                                ? null
                                : new { p.AccountId, p.Account.Name },

                            MainCategory = p.MainCategory == null
                                ? null
                                : new { p.MainCategoryId, p.MainCategory.Name },

                            SubCategory = p.SubCategory == null
                                ? null
                                : new { p.SubCategoryId, p.SubCategory.Name },
                        }),

                        Accounts = accounts.Select(a => new { a.ID, a.Name }),
                        MainCategories = mainCategories.Select(c => new { c.ID, c.Name }),
                        SubCategories = subCategories.Select(sc => new
                        {
                            sc.ID,
                            sc.Name,
                            sc.MainCategoryId,
                        }),
                    },
                }
            );
        }
    }
}
