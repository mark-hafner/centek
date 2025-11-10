using Centek.Data;
using Microsoft.EntityFrameworkCore;

namespace Centek.Services
{
    public class MainCategoryDelete(CentekContext context, SubCategoryDelete subCategoryDelete)
    {
        private readonly CentekContext _context = context;
        private readonly SubCategoryDelete _subCategoryDelete = subCategoryDelete;

        public async Task<bool> DeleteMainCategoryAsync(int id)
        {
            var mainCategory = await _context.MainCategories.FindAsync(id);
            if (mainCategory == null)
                return false;

            var subCategories = await _context
                .SubCategories.Where(s => s.MainCategoryId == mainCategory.ID)
                .ToListAsync();

            foreach (var subCategory in subCategories)
            {
                if (!await _subCategoryDelete.DeleteSubCategoryAsync(subCategory.ID))
                {
                    Console.WriteLine("SUBCATEGORY NOT DELETED");
                }
            }
            _context.MainCategories.Remove(mainCategory);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
