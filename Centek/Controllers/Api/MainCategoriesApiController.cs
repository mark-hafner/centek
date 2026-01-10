using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Centek.Data;
using Centek.Filters;
using Centek.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Centek.Controllers_Api
{
    [Route("api/v1/mainCategories")]
    [ApiController]
    [ApiKeyAuth]
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
            var userId = HttpContext.Request.Headers["UserId"].ToString();
            // get users main categories
            var userMainCategories = await _context
                .MainCategories.Where(a => a.UserId == userId)
                .ToListAsync();

            return userMainCategories;
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
        [HttpPost("createMainCategory")]
        public async Task<ActionResult<MainCategory>> PostMainCategory(
            [FromBody] MainCategoryCreateRequest request
        )
        {
            var mainCategory = new MainCategory
            {
                Name = request.Name,
                UserId = HttpContext.Request.Headers["UserId"].ToString(),

            };
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
