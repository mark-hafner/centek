using Centek.Data;
using Microsoft.EntityFrameworkCore;

namespace Centek.Services
{
    public class SubCategoryDelete(CentekContext context)
    {
        private readonly CentekContext _context = context;

        public async Task<bool> DeleteSubCategoryAsync(int id)
        {
            var subCategory = await _context.SubCategories.FindAsync(id);
            if (subCategory == null)
                return false;

            _context.SubCategories.Remove(subCategory);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
