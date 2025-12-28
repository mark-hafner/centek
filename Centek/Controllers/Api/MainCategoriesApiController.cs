using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Centek.Data;
using Centek.Models;

namespace Centek.Controllers_Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class MainCategoriesApiController : ControllerBase
    {
        private readonly CentekContext _context;

        public MainCategoriesApiController(CentekContext context)
        {
            _context = context;
        }

        // GET: api/MainCategoriesApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MainCategory>>> GetMainCategories()
        {
            return await _context.MainCategories.ToListAsync();
        }

        // GET: api/MainCategoriesApi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MainCategory>> GetMainCategory(int id)
        {
            var mainCategory = await _context.MainCategories.FindAsync(id);

            if (mainCategory == null)
            {
                return NotFound();
            }

            return mainCategory;
        }

        // PUT: api/MainCategoriesApi/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMainCategory(int id, MainCategory mainCategory)
        {
            if (id != mainCategory.ID)
            {
                return BadRequest();
            }

            _context.Entry(mainCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MainCategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/MainCategoriesApi
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<MainCategory>> PostMainCategory(MainCategory mainCategory)
        {
            _context.MainCategories.Add(mainCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMainCategory", new { id = mainCategory.ID }, mainCategory);
        }

        // DELETE: api/MainCategoriesApi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMainCategory(int id)
        {
            var mainCategory = await _context.MainCategories.FindAsync(id);
            if (mainCategory == null)
            {
                return NotFound();
            }

            _context.MainCategories.Remove(mainCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MainCategoryExists(int id)
        {
            return _context.MainCategories.Any(e => e.ID == id);
        }
    }
}
