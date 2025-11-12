using System.Net.Sockets;
using Centek.Data;
using Centek.Models;
using Centek.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
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
            var viewModel = new PaymentsViewModel
            {
                Payments = await _context.Payments.ToListAsync(),
                RecurringPayments = await _context.RecurringPayment.ToListAsync(),
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

        // Helper for generating items in the Main and Sub Category dropdown menu
        private async Task GenerateMainAndSubCategoryDropdownAsync(
            int? selectedAccountId = null,
            int? selectedMainCategoryId = null,
            int? selectedSubCategoryId = null
        )
        {
            // get current user
            var user = await _userManager.GetUserAsync(User);

            //Accounts
            var accounts = await _context
                .Accounts.Where(a => a.UserId == user.Id)
                .Select(c => new { c.ID, c.Name })
                .ToListAsync();

            ViewData["AccountId"] = new SelectList(accounts, "ID", "Name", selectedAccountId);

            // Main categories
            var mainCategories = await _context
                .MainCategories.Where(c => c.UserId == user.Id)
                .Select(c => new { c.ID, c.Name })
                .ToListAsync();

            ViewData["MainCategoryId"] = new SelectList(
                mainCategories,
                "ID",
                "Name",
                selectedMainCategoryId
            );

            IEnumerable<object> subCategories = Enumerable.Empty<object>();

            if (mainCategories.Any() && selectedMainCategoryId.HasValue)
            {
                subCategories = await _context
                    .SubCategories.Where(sc => sc.MainCategoryId == selectedMainCategoryId.Value)
                    .Select(sc => new { sc.ID, sc.Name })
                    .ToListAsync();
            }

            ViewData["SubCategoryId"] = new SelectList(
                subCategories,
                "ID",
                "Name",
                selectedSubCategoryId
            );
        }

        // GET: Payments/Create
        public async Task<IActionResult> Create()
        {
            await GenerateMainAndSubCategoryDropdownAsync();
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
            await GenerateMainAndSubCategoryDropdownAsync(
                payment.AccountId,
                payment.MainCategoryId,
                payment.SubCategoryId
            );
            return View(payment);
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
            await GenerateMainAndSubCategoryDropdownAsync(
                payment.MainCategoryId,
                payment.SubCategoryId
            );
            return View(payment);
        }

        // POST: Payments/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(
            int id,
            [Bind("ID,Name,Note,Type,Value,Date,MainCategoryId,SubCategoryId")] Payment payment
        )
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
            await GenerateMainAndSubCategoryDropdownAsync(
                payment.MainCategoryId,
                payment.SubCategoryId
            );
            return View(payment);
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
