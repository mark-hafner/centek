using Centek.Data;
using Centek.Models;
using Centek.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting.Internal;
using Microsoft.IdentityModel.Tokens;

namespace Centek.Controllers
{
    [Authorize]
    public class SubCategoriesController : Controller
    {
        private readonly CentekContext _context;
        private readonly UserManager<User> _userManager;
        private readonly MainCategoryService _mainCategoryService;
        private readonly SubCategoryService _subCategoryService;

        public SubCategoriesController(
            CentekContext context,
            UserManager<User> userManager,
            MainCategoryService mainCategoryService,
            SubCategoryService subCategoryService
        )
        {
            _context = context;
            _userManager = userManager;
            _mainCategoryService = mainCategoryService;
            _subCategoryService = subCategoryService;
        }

        [HttpGet]
        public async Task<SubCategory?> GetSubcategories(int? id)
        {
            if (id == null)
                return null;

            // cached, already includes MainCategory
            return await _subCategoryService.GetAsync(_userManager.GetUserId(User)!, id.Value);
        }

        // GET: SubCategories
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            // only this user's subcategories (cached)
            return View(await _subCategoryService.GetForUserAsync(_userManager.GetUserId(User)!));
        }

        // GET: SubCategories/Details/5
        [HttpGet]
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            var subCategory = await GetSubcategories(id);

            if (subCategory == null)
            {
                return NotFound();
            }
            return View(subCategory);
        }

        // Helper for generating items in the MainCategory dropdown menu
        private async Task GenerateMainCategoryDropdownAsync(object? selectedValue = null)
        {
            // Get only MainCategories for this user (cached)
            var mainCategories = await _mainCategoryService.GetForUserAsync(
                _userManager.GetUserId(User)!
            );
            // put recived data into ViewBag for display in select
            ViewBag.MainCategories = new SelectList(mainCategories, "ID", "Name", selectedValue);
        }

        // GET: SubCategories/Create
        [HttpGet]
        public async Task<IActionResult> Create()
        {
            //populate main category dropdown
            await GenerateMainCategoryDropdownAsync();
            return View();
        }

        // POST: SubCategories/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(SubCategory subCategory)
        {
            if (!ModelState.IsValid)
            {
                // repopulate dropdown if validation fails
                await GenerateMainCategoryDropdownAsync(subCategory.MainCategoryId);
                return View(subCategory);
            }
            _context.Add(subCategory);
            await _context.SaveChangesAsync();
            await _subCategoryService.InvalidateAsync(_userManager.GetUserId(User)!);
            return RedirectToAction("Index", "MainCategories");
        }

        // GET: SubCategories/Edit/5
        [HttpGet]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
                return NotFound();
            var subCategory = await GetSubcategories(id);

            if (subCategory == null)
                return NotFound();

            //populate main category dropdown
            await GenerateMainCategoryDropdownAsync(subCategory.MainCategoryId);
            return View(subCategory);
        }

        // POST: SubCategories/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, SubCategory subCategory)
        {
            if (id != subCategory.ID)
                return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    //get current subCategory from database
                    var subCategoryInDb = await _context.SubCategories.FindAsync(id);
                    if (subCategoryInDb == null)
                        return NotFound();

                    //update SAME subCategory that is in database
                    subCategoryInDb.Name = subCategory.Name;
                    subCategoryInDb.MainCategoryId = subCategory.MainCategoryId;
                    await _context.SaveChangesAsync();
                    await _subCategoryService.InvalidateAsync(_userManager.GetUserId(User)!);
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!SubCategoryExists(subCategory.ID))
                        return NotFound();
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("Index", "MainCategories");
            }

            //populate main category dropdown
            await GenerateMainCategoryDropdownAsync(subCategory.MainCategoryId);
            return View(subCategory);
        }

        // GET: SubCategories/Delete/5
        [HttpGet]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            var subCategory = await GetSubcategories(id);

            if (subCategory == null)
            {
                return NotFound();
            }

            return View(subCategory);
        }

        // POST: SubCategories/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var subCategory = await _context.SubCategories.FindAsync(id);
            if (subCategory != null)
            {
                var categorisedPayments = await _context
                    .Payments.Where(p => p.SubCategoryId == subCategory.ID)
                    .ToListAsync();
                foreach (var catPayment in categorisedPayments)
                {
                    catPayment.SubCategory = null;
                    catPayment.SubCategoryId = null;
                }

                var categorisedRecPayments = await _context
                    .RecurringPayment.Where(p => p.SubCategoryId == subCategory.ID)
                    .ToListAsync();
                foreach (var catPayment in categorisedRecPayments)
                {
                    catPayment.SubCategory = null;
                    catPayment.SubCategoryId = null;
                }
                _context.SubCategories.Remove(subCategory);
            }

            await _context.SaveChangesAsync();
            await _subCategoryService.InvalidateAsync(_userManager.GetUserId(User)!);
            return RedirectToAction("Index", "MainCategories");
        }

        private bool SubCategoryExists(int id)
        {
            return _context.SubCategories.Any(e => e.ID == id);
        }
    }
}
