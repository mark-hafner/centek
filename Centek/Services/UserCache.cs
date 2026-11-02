using Microsoft.Extensions.Caching.Hybrid;

namespace Centek.Services
{
    // Every cached entry is tagged with its owner, so any create/edit/delete
    // can drop all of that user's cached data in one call.
    public static class UserCache
    {
        public static string Tag(string userId) => $"user:{userId}";

        public static async Task<List<T>> GetOrCreateForUserAsync<T>(
            this HybridCache cache,
            string key,
            string userId,
            Func<CancellationToken, Task<List<T>>> factory,
            CancellationToken ct
        ) =>
            await cache.GetOrCreateAsync(
                $"{key}:{userId}",
                async c => await factory(c),
                tags: [Tag(userId)],
                cancellationToken: ct
            );

        public static ValueTask InvalidateUserAsync(this HybridCache cache, string userId) =>
            cache.RemoveByTagAsync(Tag(userId));
    }
}
