using Centek.Data;
using Centek.Models;
using Centek.Models.ViewModels;
using Centek.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Centek.Controllers
{
    [Authorize]
    public class MainCategoriesController(
        CentekContext context,
        UserManager<User> userManager,
        SubCategoryDelete subCategoryDelete,
        MainCategoryService mainCategoryService,
        SubCategoryService subCategoryService
    ) : Controller
    {
        private readonly CentekContext _context = context;
        private readonly UserManager<User> _userManager = userManager;
        private readonly SubCategoryDelete _subCategoryDelete = subCategoryDelete;
        private readonly MainCategoryService _mainCategoryService = mainCategoryService;
        private readonly SubCategoryService _subCategoryService = subCategoryService;

        // GET: MainCategories
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            // get user specific categories (cached)
            var userId = _userManager.GetUserId(User)!;

            // Get MainCategories for this user
            var mainCategories = await _mainCategoryService.GetForUserAsync(userId);

            // Get SubCategories conected to MainCategories
            var subCategories = await _subCategoryService.GetForUserAsync(userId);

            var viewModel = new CategoryViewModel
            {
                MainCategories = mainCategories,
                SubCategories = subCategories,
            };

            return View(viewModel);
        }

        // GET: MainCategories/Details/5
        [HttpGet]
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            // show only categories from current user (cached)
            var mainCategory = await _mainCategoryService.GetAsync(
                _userManager.GetUserId(User)!,
                id.Value
            );
            if (mainCategory == null)
            {
                return NotFound();
            }

            return View(mainCategory);
        }

        // GET: MainCategories/Create
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // POST: MainCategories/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(MainCategory mainCategory)
        {
            var user = await _userManager.GetUserAsync(User); //get current user
            //match current user with his categories
            mainCategory.UserId = user!.Id;
            mainCategory.User = user;
            if (!ModelState.IsValid)
            {
                return View(mainCategory);
            }
            _context.Add(mainCategory);
            await _context.SaveChangesAsync();
            await _mainCategoryService.InvalidateAsync(user.Id);
            return RedirectToAction(nameof(Index));
        }

        // GET: MainCategories/Edit/5
        [HttpGet]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            // show only categories from current user (cached)
            var mainCategory = await _mainCategoryService.GetAsync(
                _userManager.GetUserId(User)!,
                id.Value
            );
            if (mainCategory == null)
            {
                return NotFound();
            }
            return View(mainCategory);
        }

        // POST: MainCategories/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, MainCategory updatedCategory)
        {
            var user = await _userManager.GetUserAsync(User); //get current user
            // show only categories from current user
            var existingCategory = await _context.MainCategories.FirstOrDefaultAsync(c =>
                c.ID == id && c.UserId == user!.Id
            );

            if (existingCategory == null)
                return NotFound();

            existingCategory.Name = updatedCategory.Name;

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(existingCategory);
                    await _context.SaveChangesAsync();
                    await _mainCategoryService.InvalidateAsync(user!.Id);
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!MainCategoryExists(existingCategory.ID))
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
            return View(existingCategory);
        }

        // GET: MainCategories/Delete/5
        [HttpGet]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            // show only categories from current user (cached)
            var mainCategory = await _mainCategoryService.GetAsync(
                _userManager.GetUserId(User)!,
                id.Value
            );
            if (mainCategory == null)
            {
                return NotFound();
            }

            return View(mainCategory);
        }

        // POST: MainCategories/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var user = await _userManager.GetUserAsync(User); //get current user
            // show only categories from current user
            var mainCategory = await _context.MainCategories.FirstOrDefaultAsync(c =>
                c.ID == id && c.UserId == user!.Id
            );
            if (mainCategory != null)
            {
                // Get SubCategories conected to MainCategories
                var subCategories = await _context
                    .SubCategories.Where(s => s.MainCategoryId == mainCategory.ID)
                    .ToListAsync();

                var categorisedPayments = await _context
                    .Payments.Where(p => p.MainCategoryId == mainCategory.ID)
                    .ToListAsync();
                foreach (var catPayment in categorisedPayments)
                {
                    catPayment.MainCategory = null;
                    catPayment.MainCategoryId = null;
                }

                var categorisedRecPayments = await _context
                    .RecurringPayment.Where(p => p.MainCategoryId == mainCategory.ID)
                    .ToListAsync();
                foreach (var catPayment in categorisedRecPayments)
                {
                    catPayment.MainCategory = null;
                    catPayment.MainCategoryId = null;
                }
                foreach (var subCategory in subCategories)
                {
                    if (!await _subCategoryDelete.DeleteSubCategoryAsync(subCategory.ID))
                    {
                        Console.WriteLine("SUBCATEGORY NOT DELETED");
                    }
                }
                _context.MainCategories.Remove(mainCategory);
                await _context.SaveChangesAsync();
                await _mainCategoryService.InvalidateAsync(user!.Id);
            }

            return RedirectToAction(nameof(Index));
        }

        private bool MainCategoryExists(int id)
        {
            return _context.MainCategories.Any(e => e.ID == id);
        }
    }
}
