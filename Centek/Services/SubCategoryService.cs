using Centek.Data;
using Centek.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;

namespace Centek.Services
{
    public class SubCategoryService(CentekContext context, HybridCache cache)
    {
        // includes MainCategory name, without back-references
        public Task<List<SubCategory>> GetForUserAsync(
            string userId,
            CancellationToken ct = default
        ) =>
            cache.GetOrCreateForUserAsync(
                "subCategories",
                userId,
                c =>
                    context
                        .SubCategories.Where(sc => sc.MainCategory!.UserId == userId)
                        .Select(sc => new SubCategory
                        {
                            ID = sc.ID,
                            Name = sc.Name,
                            MainCategoryId = sc.MainCategoryId,
                            MainCategory = new MainCategory
                            {
                                ID = sc.MainCategory!.ID,
                                Name = sc.MainCategory.Name,
                                UserId = sc.MainCategory.UserId,
                            },
                        })
                        .ToListAsync(c),
                ct
            );

        public async Task<SubCategory?> GetAsync(
            string userId,
            int id,
            CancellationToken ct = default
        ) => (await GetForUserAsync(userId, ct)).FirstOrDefault(sc => sc.ID == id);

        public async Task<List<SubCategory>> GetByMainCategoryAsync(
            string userId,
            int mainCategoryId,
            CancellationToken ct = default
        ) =>
            (await GetForUserAsync(userId, ct))
                .Where(sc => sc.MainCategoryId == mainCategoryId)
                .ToList();

        public ValueTask InvalidateAsync(string userId) => cache.InvalidateUserAsync(userId);
    }
}
