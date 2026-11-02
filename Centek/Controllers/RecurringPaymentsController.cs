using Centek.Data;
using Centek.Models;
using Centek.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace Centek.Controllers
{
    [Authorize]
    public class RecurringPaymentsController(
        CentekContext context,
        UserManager<User> userManager,
        AccountService accountService,
        MainCategoryService mainCategoryService,
        SubCategoryService subCategoryService,
        RecurringPaymentService recurringPaymentService
    ) : Controller
    {
        private readonly CentekContext _context = context;
        private readonly UserManager<User> _userManager = userManager;
        private readonly AccountService _accountService = accountService;
        private readonly MainCategoryService _mainCategoryService = mainCategoryService;
        private readonly SubCategoryService _subCategoryService = subCategoryService;
        private readonly RecurringPaymentService _recurringPaymentService = recurringPaymentService;

        // GET: RecurringPayments/Details/5
        [HttpGet]
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
                return NotFound();

            // cached, already includes Account / MainCategory / SubCategory
            var recurringPayment = await _recurringPaymentService.GetAsync(_userManager.GetUserId(User)!, id.Value);

            if (recurringPayment == null)
                return NotFound();

            await PopulateViewBag(recurringPayment); // pass payment to pre-select dropdowns

            return View(recurringPayment); // pass the model to the view
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
        public async Task PopulateViewBag(RecurringPayment? recurringPayment = null)
        {
            var userId = _userManager.GetUserId(User)!;

            var accounts = await _accountService.GetForUserAsync(userId);
            ViewBag.Accounts = new SelectList(accounts, "ID", "Name", recurringPayment?.AccountId);

            var mainCategories = await _mainCategoryService.GetForUserAsync(userId);
            ViewBag.MainCategories = new SelectList(
                mainCategories,
                "ID",
                "Name",
                recurringPayment?.MainCategoryId
            );

            var subCategories =
                recurringPayment?.MainCategoryId != null
                    ? await _subCategoryService.GetByMainCategoryAsync(
                        userId,
                        recurringPayment.MainCategoryId.Value
                    )
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
                StartDate = new DateTime(now.Year, now.Month, now.Day),
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
                await _recurringPaymentService.InvalidateAsync(_userManager.GetUserId(User)!);
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

            // cached, already includes Account / MainCategory / SubCategory
            var recurringPayment = await _recurringPaymentService.GetAsync(_userManager.GetUserId(User)!, id.Value);

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
                    await _recurringPaymentService.InvalidateAsync(_userManager.GetUserId(User)!);
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

            // cached, already includes Account / MainCategory / SubCategory
            var recurringPayment = await _recurringPaymentService.GetAsync(_userManager.GetUserId(User)!, id.Value);

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
                var toDate = DateTime.Today;
                var frequency = recurringPayment.RecFrequency;
                var interval = recurringPayment.RecInterval;
                DateTime startDate = (DateTime)recurringPayment.StartDate!;
                DateTime endDate = recurringPayment.EndDate ?? DateTime.MaxValue;
                DateTime date = startDate;
                while (date <= toDate)
                {
                    if (date >= endDate)
                        break;

                    var payment = new Payment
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
                    };
                    _context.Add(payment);
                    await _context.SaveChangesAsync();

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

                _context.RecurringPayment.Remove(recurringPayment);
            }

            await _context.SaveChangesAsync();
            await _recurringPaymentService.InvalidateAsync(_userManager.GetUserId(User)!);
            return RedirectToAction("Index", "Payments");
        }

        private bool RecurringPaymentExists(int id)
        {
            return _context.RecurringPayment.Any(e => e.ID == id);
        }
    }
}
