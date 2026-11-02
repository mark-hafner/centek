using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Centek.Data;
using Centek.Models;
using Centek.Services;
using Microsoft.AspNetCore.Identity;
using System.Numerics;

namespace Centek.Controllers
{
    [Authorize]
    public class StatsController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly AccountService _accountService;
        private readonly MainCategoryService _mainCategoryService;
        private readonly SubCategoryService _subCategoryService;
        private readonly PaymentService _paymentService;
        private readonly RecurringPaymentService _recurringPaymentService;

        public StatsController(
            UserManager<User> userManager,
            AccountService accountService,
            MainCategoryService mainCategoryService,
            SubCategoryService subCategoryService,
            PaymentService paymentService,
            RecurringPaymentService recurringPaymentService
        )
        {
            _userManager = userManager;
            _accountService = accountService;
            _mainCategoryService = mainCategoryService;
            _subCategoryService = subCategoryService;
            _paymentService = paymentService;
            _recurringPaymentService = recurringPaymentService;
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

            var userId = _userManager.GetUserId(User)!;

            // All payments from user (cached, filtered in memory)
            var allPayments = await _paymentService.GetForUserAsync(userId);
            IEnumerable<Payment> paymentsQuery = allPayments;

            // All recurring payments from user (cached, filtered in memory)
            IEnumerable<RecurringPayment> recPaymentsQuery =
                await _recurringPaymentService.GetForUserAsync(userId);

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
            var payments = paymentsQuery.ToList();
            var recPayments = recPaymentsQuery.ToList();

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

            // only show filter options that have payments
            var usedAccountIds = allPayments.Select(p => p.AccountId).ToHashSet();
            var usedMainCategoryIds = allPayments.Select(p => p.MainCategoryId).ToHashSet();
            var usedSubCategoryIds = allPayments.Select(p => p.SubCategoryId).ToHashSet();

            // Accounts
            ViewData["Accounts"] = (await _accountService.GetForUserAsync(userId))
                .Where(a => usedAccountIds.Contains(a.ID))
                .ToList();

            // MainCategories
            ViewData["MainCategories"] = (await _mainCategoryService.GetForUserAsync(userId))
                .Where(c => usedMainCategoryIds.Contains(c.ID))
                .ToList();

            // SubCategories
            ViewData["SubCategories"] = (await _subCategoryService.GetForUserAsync(userId))
                .Where(sc => usedSubCategoryIds.Contains(sc.ID))
                .ToList();

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
