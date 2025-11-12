using System.Numerics;
using Centek.Data;
using Centek.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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

        public async Task<IActionResult> Index(
            int? accountId,
            int? mainCategoryId,
            int? subCategoryId,
            bool? type,
            DateTime? fromDate,
            DateTime? toDate
        )
        {
            var user = await _userManager.GetUserAsync(User);

            // All payments from user
            var paymentsQuery = _context
                .Payments.Include(p => p.Account)
                .Include(p => p.MainCategory)
                .Include(p => p.SubCategory)
                .Where(p => p.Account.UserId == user.Id)
                .AsQueryable();

            // Filters
            if (accountId.HasValue)
                paymentsQuery = paymentsQuery.Where(p => p.AccountId == accountId);

            if (mainCategoryId.HasValue)
                paymentsQuery = paymentsQuery.Where(p => p.MainCategoryId == mainCategoryId);

            if (subCategoryId.HasValue)
                paymentsQuery = paymentsQuery.Where(p => p.SubCategoryId == subCategoryId);

            if (type.HasValue)
                paymentsQuery = paymentsQuery.Where(p => p.Type == type);

            if (fromDate.HasValue)
                paymentsQuery = paymentsQuery.Where(p => p.Date >= fromDate);

            if (toDate.HasValue)
                paymentsQuery = paymentsQuery.Where(p => p.Date <= toDate);

            // Execute query
            var payments = await paymentsQuery.ToListAsync();

            //ACCOUNTS
            var accountGroups = payments
                .GroupBy(p => p.Account.Name)
                .Select(g => new
                {
                    Label = g.Key,
                    Value = g.Sum(p => p.Type ? p.Amount : -p.Amount),
                })
                .ToList();


            ViewBag.AccountLabels = accountGroups.Select(x => x.Label).ToList();
            ViewBag.AccountValues = accountGroups.Select(x => x.Value).ToList();

            return View();
        }
    }
}
