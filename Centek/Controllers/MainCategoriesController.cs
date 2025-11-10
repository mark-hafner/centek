using Microsoft.EntityFrameworkCore;
using Centek.Data;
using Centek.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;


namespace Centek.Controllers
{
    [Authorize]
    public class MainCategoriesController : Controller
    {
        private readonly CentekContext _context;
        private readonly UserManager<User> _userManager;

        public MainCategoriesController(CentekContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: MainCategories
        public async Task<IActionResult> Index()
        {
            var user = await _userManager.GetUserAsync(User); //get current user
            var MainCategories = await _context
                .MainCategories.Where(c => c.UserId == user.Id)
                .ToListAsync();
            return View(MainCategories);
        }

        // GET: MainCategories/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var mainCategory = await _context.MainCategories.FirstOrDefaultAsync(m => m.ID == id);
            if (mainCategory == null)
            {
                return NotFound();
            }

            return View(mainCategory);
        }

        // GET: MainCategories/Create
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
            Console.WriteLine(user.Id);
            mainCategory.UserId = user.Id;
            mainCategory.User = user;
            if (!ModelState.IsValid)
            {
                Console.WriteLine("Invalid Model");
                return View(mainCategory);
            }

            _context.Add(mainCategory);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));

        }

        // GET: MainCategories/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var user = await _userManager.GetUserAsync(User); //get current user
            var mainCategory = await _context.MainCategories.FirstOrDefaultAsync(c => c.ID == id && c.UserId == user.Id);
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
            var existingCategory = await _context.MainCategories.FirstOrDefaultAsync(c => c.ID == id && c.UserId == user.Id);

            if (existingCategory == null)
                return NotFound();

            existingCategory.Name = updatedCategory.Name;

            if (ModelState.IsValid)
            {
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            return View(existingCategory);
        }


        // GET: MainCategories/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var user = await _userManager.GetUserAsync(User); //get current user
            var mainCategory = await _context.MainCategories.FirstOrDefaultAsync(c => c.ID == id && c.UserId == user.Id);
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
            var mainCategory = await _context.MainCategories.FirstOrDefaultAsync(c => c.ID == id && c.UserId == user.Id);
            if (mainCategory != null)
            {
                _context.MainCategories.Remove(mainCategory);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool MainCategoryExists(int id)
        {
            return _context.MainCategories.Any(e => e.ID == id);
        }
    }
}
