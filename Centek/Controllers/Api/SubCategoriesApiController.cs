using Centek.Data;
using Centek.Filters;
using Centek.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace Centek.Controllers_Api
{
    [Route("api/v1/subCategories")]
    [ApiController]
    [ApiKeyAuth]
    public class SubCategoriesApiController : ControllerBase
    {
        private readonly CentekContext _context;

        public SubCategoriesApiController(CentekContext context)
        {
            _context = context;
        }

        // GET: api/SubCategoriesApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubCategory>>> GetSubCategories()
        {
            var userId = HttpContext.Request.Headers["UserId"].ToString();
            var mainCategoryIds = await _context
                .MainCategories.Where(c => c.UserId == userId)
                .Select(c => c.ID) // only IDs!
                .ToListAsync();
            if (mainCategoryIds.Count == 0)
            {
                return null;
            }
            // get all subcategories for these categories
            // var subCategory = await _context.SubCategories.FirstOrDefaultAsync(s =>
            //     s.ID == id && mainCategoryIds.Contains(s.MainCategoryId)
            // );
            var subCategory = await _context.SubCategories.ToListAsync();
            return subCategory;
        }

        // GET: api/SubCategoriesApi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SubCategory>> GetSubCategory(int id)
        {
            var subCategory = await _context.SubCategories.FindAsync(id);

            if (subCategory == null)
            {
                return NotFound();
            }

            return subCategory;
        }

        // PUT: api/SubCategoriesApi/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubCategory(int id, SubCategory subCategory)
        {
            if (id != subCategory.ID)
            {
                return BadRequest();
            }

            _context.Entry(subCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubCategoryExists(id))
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

        // POST: api/SubCategoriesApi
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SubCategory>> PostSubCategory(SubCategory subCategory)
        {
            _context.SubCategories.Add(subCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSubCategory", new { id = subCategory.ID }, subCategory);
        }

        // DELETE: api/SubCategoriesApi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubCategory(int id)
        {
            var subCategory = await _context.SubCategories.FindAsync(id);
            if (subCategory == null)
            {
                return NotFound();
            }

            _context.SubCategories.Remove(subCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SubCategoryExists(int id)
        {
            return _context.SubCategories.Any(e => e.ID == id);
        }
    }
}
