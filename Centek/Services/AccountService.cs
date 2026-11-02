using Centek.Data;
using Centek.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;

namespace Centek.Services
{
    public class AccountService(CentekContext context, HybridCache cache)
    {
        // projected to plain objects (no User / Payments) so they serialize cleanly to Redis
        public Task<List<Account>> GetForUserAsync(string userId, CancellationToken ct = default) =>
            cache.GetOrCreateForUserAsync(
                "accounts",
                userId,
                c =>
                    context
                        .Accounts.Where(a => a.UserId == userId)
                        .Select(a => new Account
                        {
                            ID = a.ID,
                            Name = a.Name,
                            UserId = a.UserId,
                        })
                        .ToListAsync(c),
                ct
            );

        public async Task<Account?> GetAsync(string userId, int id, CancellationToken ct = default) =>
            (await GetForUserAsync(userId, ct)).FirstOrDefault(a => a.ID == id);

        public ValueTask InvalidateAsync(string userId) => cache.InvalidateUserAsync(userId);
    }
}
