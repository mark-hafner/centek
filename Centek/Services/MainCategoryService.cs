using Centek.Data;
using Centek.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;

namespace Centek.Services
{
    public class MainCategoryService(CentekContext context, HybridCache cache)
    {
        public Task<List<MainCategory>> GetForUserAsync(
            string userId,
            CancellationToken ct = default
        ) =>
            cache.GetOrCreateForUserAsync(
                "mainCategories",
                userId,
                c =>
                    context
                        .MainCategories.Where(mc => mc.UserId == userId)
                        .Select(mc => new MainCategory
                        {
                            ID = mc.ID,
                            Name = mc.Name,
                            UserId = mc.UserId,
                        })
                        .ToListAsync(c),
                ct
            );

        public async Task<MainCategory?> GetAsync(
            string userId,
            int id,
            CancellationToken ct = default
        ) => (await GetForUserAsync(userId, ct)).FirstOrDefault(mc => mc.ID == id);

        public ValueTask InvalidateAsync(string userId) => cache.InvalidateUserAsync(userId);
    }
}
