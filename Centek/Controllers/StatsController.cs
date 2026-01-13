using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Centek.Data;
using Centek.Models;
using Microsoft.AspNetCore.Identity;
using System.Numerics;

namespace Centek.Controllers
{
    [Authorize]
    public class StatsController : Controller
    {
        private readonly CentekContext _context;
        private readonly UserManager<User> _userManager;

        public StatsController(CentekContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> Index(
            List<int?>? accountIds,
            List<int?>? mainCategoryIds,
            List<int?>? subCategoryIds,
            bool? type,
            DateTime? fromDate,
            DateTime? toDate
        )
        {
            var defaultFrom = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);
            var defaultTo = DateTime.Today;

            fromDate = fromDate ?? defaultFrom;
            toDate = toDate ?? defaultTo;
            toDate = toDate.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59);

            var user = await _userManager.GetUserAsync(User);

            // All payments from user
            var paymentsQuery = _context.Payments
                .Include(p => p.Account)
                .Include(p => p.MainCategory)
                .Include(p => p.SubCategory)
                .Where(p => p.Account!.UserId == user!.Id)
                .AsQueryable();

            // All recurring payments from user
            var recPaymentsQuery = _context.RecurringPayment
                .Include(p => p.Account)
                .Include(p => p.MainCategory)
                .Include(p => p.SubCategory)
                .Where(p => p.Account!.UserId == user!.Id)
                .AsQueryable();

            // Filters
            if (accountIds != null && accountIds.Any())
            {
                paymentsQuery = paymentsQuery.Where(p => accountIds.Contains(p.AccountId));
                recPaymentsQuery = recPaymentsQuery.Where(p => accountIds.Contains(p.AccountId));
            }

            if (mainCategoryIds != null && mainCategoryIds.Any())
            {
                paymentsQuery = paymentsQuery.Where(p => mainCategoryIds.Contains(p.MainCategoryId));
                recPaymentsQuery = recPaymentsQuery.Where(p => mainCategoryIds.Contains(p.MainCategoryId));
            }

            if (subCategoryIds != null && subCategoryIds.Any())
            {
                paymentsQuery = paymentsQuery.Where(p => subCategoryIds.Contains(p.SubCategoryId));
                recPaymentsQuery = recPaymentsQuery.Where(p => subCategoryIds.Contains(p.SubCategoryId));
            }

            if (type.HasValue)
            {
                paymentsQuery = paymentsQuery.Where(p => p.Type == type);
                recPaymentsQuery = recPaymentsQuery.Where(p => p.Type == type);
            }

            if (fromDate.HasValue)
            {
                paymentsQuery = paymentsQuery.Where(p => p.Date >= fromDate);
                recPaymentsQuery = recPaymentsQuery.Where(p => !p.EndDate.HasValue || p.EndDate >= fromDate);
            }

            if (toDate.HasValue)
            {
                paymentsQuery = paymentsQuery.Where(p => p.Date <= toDate);
                recPaymentsQuery = recPaymentsQuery.Where(p => p.StartDate <= toDate);
            }

            // Query
            var payments = await paymentsQuery.ToListAsync();
            var recPayments = await recPaymentsQuery.ToListAsync();

            foreach (var recurringPayment in recPayments)
            {
                var calculatedPayments = new List<Payment>();
                var frequency = recurringPayment.RecFrequency;
                var interval = recurringPayment.RecInterval;
                DateTime startDate = (DateTime)recurringPayment.StartDate!;
                DateTime endDate = recurringPayment.EndDate ?? DateTime.MaxValue;
                DateTime date = startDate;
                while (date <= toDate)
                {
                    if (date >= endDate) break;
                    if (date >= fromDate)
                    {
                        calculatedPayments.Add(new Payment
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
                            SubCategory = recurringPayment.SubCategory
                        });
                    }

                    // increase date correctly
                    switch (frequency)
                    {
                        case RecurringPayment.Frequency.Daily:
                            date = date.AddDays((double)interval!);
                            break;

                        case RecurringPayment.Frequency.Weekly:
                            date = date.AddDays((double)(interval! * 7));
                            break;

                        case RecurringPayment.Frequency.Monthly:
                            date = date.AddMonths((int)interval!);
                            break;

                        case RecurringPayment.Frequency.Yearly:
                            date = date.AddYears((int)interval!);
                            break;
                    }
                }

                // Add to main payments list
                payments.AddRange(calculatedPayments);
            }

            payments = payments
                .OrderByDescending(p => p.Date)
                .ToList();

            // Total sum
            var total = payments.Sum(p => p.Type ? p.Amount : -p.Amount);

            // Send to View
            // Total sum
            ViewData["Total"] = total;

            // Accounts
            ViewData["Accounts"] = await _context.Accounts
                .Where(a => a.UserId == user!.Id && a.Payments!.Any())
                .ToListAsync();

            // MainCategories
            ViewData["MainCategories"] = await _context.MainCategories
                .Where(c => c.UserId == user!.Id && c.Payments!.Any())
                .ToListAsync();

            // SubCategories
            ViewData["SubCategories"] = await _context.SubCategories
                .Where(sc => sc.MainCategory!.UserId == user!.Id && sc.Payments!.Any())
                .Include(sc => sc.MainCategory)
                .ToListAsync();

            // From
            ViewData["FromDate"] = fromDate?.ToString("yyyy-MM-dd");

            // To
            ViewData["ToDate"] = toDate?.ToString("yyyy-MM-dd");


            ViewData["SelectedAccountIds"] = accountIds;
            ViewData["SelectedMainCategoryIds"] = mainCategoryIds;
            ViewData["SelectedSubCategoryIds"] = subCategoryIds;
            ViewData["SelectedType"] = type;
            ViewData["FromDate"] = fromDate?.ToString("yyyy-MM-dd");
            ViewData["ToDate"] = toDate?.ToString("yyyy-MM-dd");

            return View(payments);
        }
    }
}
