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

            return View();

        }
    }
}
