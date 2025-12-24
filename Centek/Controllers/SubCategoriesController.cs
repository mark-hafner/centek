using Centek.Data;
using Centek.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Centek.Controllers
{
    public class SubCategoriesController : Controller
    {
        private readonly CentekContext _context;
        private readonly UserManager<User> _userManager;

        public SubCategoriesController(CentekContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<SubCategory> GetSubcategories(int? id)
        {
            var user = await _userManager.GetUserAsync(User); // current user
            // Get only MainCategories for this user
            // get all main categories for user
            var mainCategoryIds = await _context.MainCategories
                .Where(c => c.UserId == user.Id)
                .Select(c => c.ID)        // only IDs!
                .ToListAsync();
            if (mainCategoryIds.IsNullOrEmpty())
            {
                return null;
            }
            // get all subcategories for these categories
            var subCategory = await _context.SubCategories
                .FirstOrDefaultAsync(s => s.ID == id && mainCategoryIds.Contains(s.MainCategoryId));
            return subCategory;
        }

        // GET: SubCategories
        public async Task<IActionResult> Index()
        {
            return View(await _context.SubCategories.ToListAsync());
        }

        // GET: SubCategories/Details/5
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
            var user = await _userManager.GetUserAsync(User); // current user
            // Get only MainCategories for this user
            var mainCategories = await _context
                .MainCategories.Where(c => c.UserId == user.Id)
                .Select(c => new { c.ID, c.Name })
                .ToListAsync();
            // put recived data into ViewBag for display in select
            ViewBag.MainCategories = new SelectList(mainCategories, "ID", "Name", selectedValue);
        }

        // GET: SubCategories/Create
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
            return RedirectToAction("Index", "MainCategories");
        }

        // GET: SubCategories/Edit/5
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
                _context.SubCategories.Remove(subCategory);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction("Index", "MainCategories");
        }

        private bool SubCategoryExists(int id)
        {
            return _context.SubCategories.Any(e => e.ID == id);
        }
    }
}
