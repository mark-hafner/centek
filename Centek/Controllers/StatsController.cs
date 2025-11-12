using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Centek.Data;
using Centek.Models;
using Microsoft.AspNetCore.Identity;

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

        public async Task<IActionResult> Index(int? accountId, int? mainCategoryId, int? subCategoryId)
        {
            var user = await _userManager.GetUserAsync(User);

            // All payments from user
            var paymentsQuery = _context.Payments
                .Include(p => p.Account)
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

            // Query
            var payments = await paymentsQuery.ToListAsync();

            // Total sum
            var total = payments.Sum(p => p.Value);

            // Send to View
            // Total sum
            ViewData["Total"] = total;

            // Accounts
            ViewData["Accounts"] = await _context.Accounts
                .Where(a => a.UserId == user.Id && a.Payments.Any())
                .ToListAsync();

            // MainCategories
            ViewData["MainCategories"] = await _context.MainCategories
                .Where(c => c.UserId == user.Id && c.Payments.Any())
                .ToListAsync();

            // SubCategories
            ViewData["SubCategories"] = await _context.SubCategories
                .Where(sc => sc.MainCategory.UserId == user.Id && sc.Payments.Any())
                .Include(sc => sc.MainCategory)
                .ToListAsync();

            return View(payments);
        }
    }
}