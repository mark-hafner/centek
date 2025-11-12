using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Centek.Data;
using Centek.Models;

namespace Centek.Controllers
{
    [Authorize]
    public class RecurringPaymentsController : Controller
    {
        private readonly CentekContext _context;

        public RecurringPaymentsController(CentekContext context)
        {
            _context = context;
        }

        // GET: RecurringPayments
        public async Task<IActionResult> Index()
        {
            var centekContext = _context.RecurringPayment.Include(r => r.MainCategory).Include(r => r.SubCategory);
            return View(await centekContext.ToListAsync());
        }

        // GET: RecurringPayments/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var recurringPayment = await _context.RecurringPayment
                .Include(r => r.MainCategory)
                .Include(r => r.SubCategory)
                .FirstOrDefaultAsync(m => m.ID == id);
            if (recurringPayment == null)
            {
                return NotFound();
            }

            return View(recurringPayment);
        }

        // GET: RecurringPayments/Create
        public IActionResult Create()
        {
            ViewData["MainCategoryId"] = new SelectList(_context.MainCategories, "ID", "ID");
            ViewData["SubCategoryId"] = new SelectList(_context.MainCategories, "ID", "ID");
            return View();
        }

        // POST: RecurringPayments/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,Name,Mote,Type,Value,StartDate,EndDate,RecFrequency,RecInterval,MainCategoryId,SubCategoryId")] RecurringPayment recurringPayment)
        {
            if (ModelState.IsValid)
            {
                _context.Add(recurringPayment);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["MainCategoryId"] = new SelectList(_context.MainCategories, "ID", "ID", recurringPayment.MainCategoryId);
            ViewData["SubCategoryId"] = new SelectList(_context.MainCategories, "ID", "ID", recurringPayment.SubCategoryId);
            return View(recurringPayment);
        }

        // GET: RecurringPayments/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var recurringPayment = await _context.RecurringPayment.FindAsync(id);
            if (recurringPayment == null)
            {
                return NotFound();
            }
            ViewData["MainCategoryId"] = new SelectList(_context.MainCategories, "ID", "ID", recurringPayment.MainCategoryId);
            ViewData["SubCategoryId"] = new SelectList(_context.MainCategories, "ID", "ID", recurringPayment.SubCategoryId);
            return View(recurringPayment);
        }

        // POST: RecurringPayments/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,Name,Mote,Type,Value,StartDate,EndDate,RecFrequency,RecInterval,MainCategoryId,SubCategoryId")] RecurringPayment recurringPayment)
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
                return RedirectToAction(nameof(Index));
            }
            ViewData["MainCategoryId"] = new SelectList(_context.MainCategories, "ID", "ID", recurringPayment.MainCategoryId);
            ViewData["SubCategoryId"] = new SelectList(_context.MainCategories, "ID", "ID", recurringPayment.SubCategoryId);
            return View(recurringPayment);
        }

        // GET: RecurringPayments/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var recurringPayment = await _context.RecurringPayment
                .Include(r => r.MainCategory)
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
            return RedirectToAction(nameof(Index));
        }

        private bool RecurringPaymentExists(int id)
        {
            return _context.RecurringPayment.Any(e => e.ID == id);
        }
    }
}
