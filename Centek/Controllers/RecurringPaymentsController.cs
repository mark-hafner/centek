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
        [HttpGet]
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
                return NotFound();

            var user = await _userManager.GetUserAsync(User);

            // Include navigation properties if you need them
            var recurringPayment = await _context
                .RecurringPayment.Where(p => p.Account.UserId == user.Id)
                .Include(p => p.Account)
                .Include(p => p.MainCategory)
                .Include(p => p.SubCategory)
                .FirstOrDefaultAsync(p => p.ID == id);

            if (recurringPayment == null)
                return NotFound();

            await PopulateViewBag(recurringPayment); // pass payment to pre-select dropdowns

            return View(recurringPayment); // pass the model to the view
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
        public async Task PopulateViewBag(RecurringPayment? recurringPayment = null)
        {
            var user = await _userManager.GetUserAsync(User);

            var accounts = await _context.Accounts.Where(a => a.UserId == user.Id).ToListAsync();
            ViewBag.Accounts = new SelectList(accounts, "ID", "Name", recurringPayment?.AccountId);

            var mainCategories = await _context
                .MainCategories.Where(c => c.UserId == user.Id)
                .ToListAsync();
            ViewBag.MainCategories = new SelectList(
                mainCategories,
                "ID",
                "Name",
                recurringPayment?.MainCategoryId
            );

            var subCategories =
                recurringPayment?.MainCategoryId != null
                    ? await _context
                        .SubCategories.Where(sc =>
                            sc.MainCategoryId == recurringPayment.MainCategoryId
                        )
                        .ToListAsync()
                    : new List<SubCategory>();
            ViewBag.SubCategories = new SelectList(
                subCategories,
                "ID",
                "Name",
                recurringPayment?.SubCategoryId
            );
        }

        // GET: RecurringPayments/Create
        [HttpGet]
        public async Task<IActionResult> Create()
        {
            await PopulateViewBag();

            var now = DateTime.Now;
            var payment = new RecurringPayment
            {
                StartDate = new DateTime(now.Year, now.Month, now.Day)
            };

            return View(payment);
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
        [HttpGet]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
                return NotFound();

            var user = await _userManager.GetUserAsync(User);

            // Include navigation properties if you need them
            var recurringPayment = await _context
                .RecurringPayment.Where(p => p.Account.UserId == user.Id)
                .Include(p => p.Account)
                .Include(p => p.MainCategory)
                .Include(p => p.SubCategory)
                .FirstOrDefaultAsync(p => p.ID == id);

            if (recurringPayment == null)
                return NotFound();

            await PopulateViewBag(recurringPayment); // pass payment to pre-select dropdowns

            return View(recurringPayment); // pass the model to the view
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
        [HttpGet]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
                return NotFound();

            var user = await _userManager.GetUserAsync(User);

            // Include navigation properties if you need them
            var recurringPayment = await _context
                .RecurringPayment.Where(p => p.Account.UserId == user.Id)
                .Include(p => p.Account)
                .Include(p => p.MainCategory)
                .Include(p => p.SubCategory)
                .FirstOrDefaultAsync(p => p.ID == id);

            if (recurringPayment == null)
                return NotFound();

            await PopulateViewBag(recurringPayment); // pass payment to pre-select dropdowns

            return View(recurringPayment); // pass the model to the view
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
