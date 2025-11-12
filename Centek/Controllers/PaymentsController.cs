using Centek.Data;
using Centek.Models;
using Centek.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Centek.Controllers
{
    [Authorize]
    public class PaymentsController(CentekContext context, UserManager<User> userManager)
        : Controller
    {
        private readonly CentekContext _context = context;
        private readonly UserManager<User> _userManager = userManager;

        // GET: Payments
        public async Task<IActionResult> Index()
        {
            var user = await _userManager.GetUserAsync(User);

            var viewModel = new PaymentsViewModel
            {
                Payments = await _context
                    .Payments.Where(p => p.Account.UserId == user.Id)
                    .Include(p => p.MainCategory)
                    .Include(p => p.SubCategory)
                    .ToListAsync(),

                RecurringPayments = await _context
                    .RecurringPayment.Where(rp => rp.Account.UserId == user.Id)
                    .Include(p => p.MainCategory)
                    .Include(p => p.SubCategory)
                    .ToListAsync(),
            };

            return View(viewModel);
        }

        // GET: Payments/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var payment = await _context
                .Payments.Include(p => p.MainCategory)
                .Include(p => p.SubCategory)
                .FirstOrDefaultAsync(m => m.ID == id);
            if (payment == null)
            {
                return NotFound();
            }

            return View(payment);
        }

        // Helper for generating items in the Sub Category dropdown menu
        [HttpGet]
        public async Task<JsonResult> GetSubCategories(int mainCategoryId)
        {
            var subCategories = await _context
                .SubCategories.Where(sc => sc.MainCategoryId == mainCategoryId)
                .Select(sc => new { sc.ID, sc.Name })
                .ToListAsync();

            return Json(subCategories);
        }

        // helper for populating ViewBag for dropdown
        public async Task PopulateViewBag()
        {
            var user = await _userManager.GetUserAsync(User);

            // Populate Accounts and MainCategories
            ViewBag.Accounts = await _context
                .Accounts.Where(a => a.UserId == user.Id)
                .ToListAsync();

            ViewBag.MainCategories = await _context
                .MainCategories.Where(c => c.UserId == user.Id)
                .ToListAsync();
        }

        // GET: Payments/Create
        public async Task<IActionResult> Create()
        {
            await PopulateViewBag();
            return View();
        }

        // POST: Payments/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Payment payment)
        {
            if (ModelState.IsValid)
            {
                _context.Add(payment);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            await PopulateViewBag();
            return View();
        }

        // GET: Payments/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
            {
                return NotFound();
            }
            await PopulateViewBag();
            return View();
        }

        // POST: Payments/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Payment payment)
        {
            if (id != payment.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(payment);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PaymentExists(payment.ID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            await PopulateViewBag();
            return View();
        }

        // GET: Payments/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var payment = await _context
                .Payments.Include(p => p.MainCategory)
                .Include(p => p.SubCategory)
                .FirstOrDefaultAsync(m => m.ID == id);
            if (payment == null)
            {
                return NotFound();
            }

            return View(payment);
        }

        // POST: Payments/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment != null)
            {
                _context.Payments.Remove(payment);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool PaymentExists(int id)
        {
            return _context.Payments.Any(e => e.ID == id);
        }
    }
}
