using Centek.Data;
using Centek.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace Centek.Controllers
{
    [Authorize]
    public class RecurringPaymentsController(CentekContext context, UserManager<User> userManager)
        : Controller
    {
        private readonly CentekContext _context = context;
        private readonly UserManager<User> _userManager = userManager;

        // GET: RecurringPayments/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var recurringPayment = await _context
                .RecurringPayment.Include(r => r.MainCategory)
                .Include(r => r.SubCategory)
                .FirstOrDefaultAsync(m => m.ID == id);
            if (recurringPayment == null)
            {
                return NotFound();
            }

            return View(recurringPayment);
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

        // GET: RecurringPayments/Create
        public async Task<IActionResult> Create()
        {
            await PopulateViewBag();
            return View();
        }

        // POST: RecurringPayments/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(RecurringPayment recurringPayment)
        {
            if (ModelState.IsValid)
            {
                _context.Add(recurringPayment);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index", "Payments");
            }
            await PopulateViewBag();
            return View();
        }

        // GET: RecurringPayments/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var recurrinPayment = await _context.RecurringPayment.FindAsync(id);
            if (recurrinPayment == null)
            {
                return NotFound();
            }
            await PopulateViewBag();
            return View();
        }

        // POST: RecurringPayments/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, RecurringPayment recurringPayment)
        {
            if (id != recurringPayment.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(recurringPayment);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!RecurringPaymentExists(recurringPayment.ID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("Index", "Payments");
            }
            await PopulateViewBag();
            return View();
        }

        // GET: RecurringPayments/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var recurringPayment = await _context
                .RecurringPayment.Include(r => r.MainCategory)
                .Include(r => r.SubCategory)
                .FirstOrDefaultAsync(m => m.ID == id);
            if (recurringPayment == null)
            {
                return NotFound();
            }

            return View(recurringPayment);
        }

        // POST: RecurringPayments/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var recurringPayment = await _context.RecurringPayment.FindAsync(id);
            if (recurringPayment != null)
            {
                _context.RecurringPayment.Remove(recurringPayment);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction("Index", "Payments");
        }

        private bool RecurringPaymentExists(int id)
        {
            return _context.RecurringPayment.Any(e => e.ID == id);
        }
    }
}
