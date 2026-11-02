using Centek.Data;
using Centek.Models;
using Centek.Services;
using Centek.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Centek.Controllers
{
    [Authorize]
    public class PaymentsController(
        CentekContext context,
        UserManager<User> userManager,
        AccountService accountService,
        MainCategoryService mainCategoryService,
        SubCategoryService subCategoryService,
        PaymentService paymentService,
        RecurringPaymentService recurringPaymentService
    ) : Controller
    {
        private readonly CentekContext _context = context;
        private readonly UserManager<User> _userManager = userManager;
        private readonly AccountService _accountService = accountService;
        private readonly MainCategoryService _mainCategoryService = mainCategoryService;
        private readonly SubCategoryService _subCategoryService = subCategoryService;
        private readonly PaymentService _paymentService = paymentService;
        private readonly RecurringPaymentService _recurringPaymentService = recurringPaymentService;

        // GET: Payments
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var userId = _userManager.GetUserId(User)!;

            // cached, already include Account / MainCategory / SubCategory
            var viewModel = new PaymentsViewModel
            {
                Payments = await _paymentService.GetForUserAsync(userId),
                RecurringPayments = await _recurringPaymentService.GetForUserAsync(userId),
            };

            return View(viewModel);
        }

        // GET: Payments/Details/5
        [HttpGet]
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
                return NotFound();

            // cached, already includes Account / MainCategory / SubCategory
            var payment = await _paymentService.GetAsync(_userManager.GetUserId(User)!, id.Value);

            if (payment == null)
                return NotFound();

            await PopulateViewBag(payment); // pass payment to pre-select dropdowns

            return View(payment); // pass the model to the view
        }

        // Helper for generating items in the Sub Category dropdown menu
        [HttpGet]
        public async Task<JsonResult> GetSubCategories(int mainCategoryId)
        {
            var subCategories = (
                await _subCategoryService.GetByMainCategoryAsync(
                    _userManager.GetUserId(User)!,
                    mainCategoryId
                )
            )
                .Select(sc => new { sc.ID, sc.Name })
                .ToList();

            return Json(subCategories);
        }

        // helper for populating ViewBag for dropdown
        public async Task PopulateViewBag(Payment? payment = null)
        {
            var userId = _userManager.GetUserId(User)!;

            var accounts = await _accountService.GetForUserAsync(userId);
            ViewBag.Accounts = new SelectList(accounts, "ID", "Name", payment?.AccountId);

            var mainCategories = await _mainCategoryService.GetForUserAsync(userId);
            ViewBag.MainCategories = new SelectList(
                mainCategories,
                "ID",
                "Name",
                payment?.MainCategoryId
            );

            var subCategories =
                payment?.MainCategoryId != null
                    ? await _subCategoryService.GetByMainCategoryAsync(
                        userId,
                        payment.MainCategoryId.Value
                    )
                    : new List<SubCategory>();
            ViewBag.SubCategories = new SelectList(
                subCategories,
                "ID",
                "Name",
                payment?.SubCategoryId
            );
        }

        // GET: Payments/Create
        [HttpGet]
        public async Task<IActionResult> Create()
        {
            await PopulateViewBag();

            var now = DateTime.Now;
            var payment = new Payment
            {
                Date = new DateTime(now.Year, now.Month, now.Day, now.Hour, now.Minute, 0)
            };

            return View(payment);
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
                await _paymentService.InvalidateAsync(_userManager.GetUserId(User)!);
                return RedirectToAction(nameof(Index));
            }
            await PopulateViewBag();
            return View();
        }

        // GET: Payments/Edit/5
        [HttpGet]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
                return NotFound();

            // cached, already includes Account / MainCategory / SubCategory
            var payment = await _paymentService.GetAsync(_userManager.GetUserId(User)!, id.Value);

            if (payment == null)
                return NotFound();

            await PopulateViewBag(payment); // pass payment to pre-select dropdowns

            return View(payment); // pass the model to the view
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
                    await _paymentService.InvalidateAsync(_userManager.GetUserId(User)!);
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
        [HttpGet]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
                return NotFound();

            // cached, already includes Account / MainCategory / SubCategory
            var payment = await _paymentService.GetAsync(_userManager.GetUserId(User)!, id.Value);

            if (payment == null)
                return NotFound();

            await PopulateViewBag(payment);

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
            await _paymentService.InvalidateAsync(_userManager.GetUserId(User)!);
            return RedirectToAction(nameof(Index));
        }

        private bool PaymentExists(int id)
        {
            return _context.Payments.Any(e => e.ID == id);
        }
    }
}
