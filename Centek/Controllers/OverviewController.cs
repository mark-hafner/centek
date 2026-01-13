using System.Numerics;
using System.Security.AccessControl;
using Centek.Data;
using Centek.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace Centek.Controllers
{
    [Authorize]
    public class OverviewController : Controller
    {
        private readonly CentekContext _context;
        private readonly UserManager<User> _userManager;

        public OverviewController(CentekContext context, UserManager<User> userManager)
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
            var paymentsQuery = _context
                .Payments.Include(p => p.Account)
                .Include(p => p.MainCategory)
                .Include(p => p.SubCategory)
                .Where(p => p.Account!.UserId == user!.Id)
                .AsQueryable();

            // All recurring payments from user
            var recPaymentsQuery = _context
                .RecurringPayment.Include(p => p.Account)
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
                paymentsQuery = paymentsQuery.Where(p =>
                    mainCategoryIds.Contains(p.MainCategoryId)
                );
                recPaymentsQuery = recPaymentsQuery.Where(p =>
                    mainCategoryIds.Contains(p.MainCategoryId)
                );
            }

            if (subCategoryIds != null  && subCategoryIds.Any())
            {
                paymentsQuery = paymentsQuery.Where(p => subCategoryIds!.Contains(p.SubCategoryId));
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

            // Execute query
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

            payments = payments.OrderByDescending(p => p.Date).ToList();

            //ACCOUNTS
            var accountGroups = payments
                .GroupBy(p => p.Account?.Name)
                .Select(g => new
                {
                    Label = g.Key,
                    Value = g.Sum(p => p.Type ? p.Amount : -p.Amount),
                })
                .ToList();

            ViewBag.AccountLabels = accountGroups.Select(x => x.Label).ToList();
            ViewBag.AccountValues = accountGroups.Select(x => x.Value).ToList();


            //MAIN CATEGORIES
            var positiveMainCatGroups = payments
                .Where(p => p.Type)
                .GroupBy(p => p.MainCategory?.Name ?? "Uncategorized")
                .Select(g => new
                {
                    Label = g.Key,
                    Value = g.Sum(p => p.Type ? p.Amount : -p.Amount),
                })
                .ToList();

            ViewBag.positiveMainCatLabels = positiveMainCatGroups.Select(x => x.Label).ToList();
            ViewBag.positiveMainCatValues = positiveMainCatGroups.Select(x => x.Value).ToList();

            var negativeMainCatGroups = payments
                .Where(p => !p.Type)
                .GroupBy(p => p.MainCategory?.Name ?? "Uncategorized")
                .Select(g => new
                {
                    Label = g.Key,
                    Value = g.Sum(p => p.Type ? p.Amount : -p.Amount),
                })
                .ToList();

            ViewBag.negativeMainCatLabels = negativeMainCatGroups.Select(x => x.Label).ToList();
            ViewBag.negativeMainCatValues = negativeMainCatGroups.Select(x => x.Value).ToList();


            // Accounts
            ViewBag.Accounts = await _context
                .Accounts.Where(a => a.UserId == user!.Id && a.Payments!.Any())
                .ToListAsync();

            // MainCategories
            ViewBag.MainCategories = await _context
                .MainCategories.Where(c => c.UserId == user!.Id && c.Payments!.Any())
                .ToListAsync();

            // SubCategories
            ViewBag.SubCategories = await _context
                .SubCategories.Where(sc => sc.MainCategory!.UserId == user!.Id && sc.Payments!.Any())
                .Include(sc => sc.MainCategory)
                .ToListAsync();

            // From
            ViewBag.FromDate = fromDate?.ToString("yyyy-MM-dd");

            // To
            ViewBag.ToDate = toDate?.ToString("yyyy-MM-dd");

            ViewBag.SelectedAccountIds = accountIds;
            ViewBag.SelectedMainCategoryIds = mainCategoryIds;
            ViewBag.SelectedSubCategoryIds = subCategoryIds;
            ViewBag.SelectedType = type;
            ViewBag.FromDate = fromDate?.ToString("yyyy-MM-dd");
            ViewBag.ToDate = toDate?.ToString("yyyy-MM-dd");
            return View();
        }
    }
}
