using Centek.Data;
using Centek.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;

namespace Centek.Services
{
    public class PaymentService(CentekContext context, HybridCache cache)
    {
        // includes Account / MainCategory / SubCategory names, without back-references
        public Task<List<Payment>> GetForUserAsync(string userId, CancellationToken ct = default) =>
            cache.GetOrCreateForUserAsync(
                "payments",
                userId,
                c =>
                    context
                        .Payments.Where(p => p.Account!.UserId == userId)
                        .Select(p => new Payment
                        {
                            ID = p.ID,
                            Name = p.Name,
                            Note = p.Note,
                            Type = p.Type,
                            Amount = p.Amount,
                            Date = p.Date,
                            AccountId = p.AccountId,
                            MainCategoryId = p.MainCategoryId,
                            SubCategoryId = p.SubCategoryId,
                            Account = new Account
                            {
                                ID = p.Account!.ID,
                                Name = p.Account.Name,
                                UserId = p.Account.UserId,
                            },
                            MainCategory =
                                p.MainCategory == null
                                    ? null
                                    : new MainCategory
                                    {
                                        ID = p.MainCategory.ID,
                                        Name = p.MainCategory.Name,
                                        UserId = p.MainCategory.UserId,
                                    },
                            SubCategory =
                                p.SubCategory == null
                                    ? null
                                    : new SubCategory
                                    {
                                        ID = p.SubCategory.ID,
                                        Name = p.SubCategory.Name,
                                        MainCategoryId = p.SubCategory.MainCategoryId,
                                    },
                        })
                        .ToListAsync(c),
                ct
            );

        public async Task<Payment?> GetAsync(string userId, int id, CancellationToken ct = default) =>
            (await GetForUserAsync(userId, ct)).FirstOrDefault(p => p.ID == id);

        public ValueTask InvalidateAsync(string userId) => cache.InvalidateUserAsync(userId);
    }
}
