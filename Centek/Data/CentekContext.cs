using Centek.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Centek.Data
{
    public class CentekContext : IdentityDbContext<User>
    {
        public CentekContext(DbContextOptions<CentekContext> options)
            : base(options) { }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<MainCategory> MainCategories { get; set; }
        public DbSet<SubCategory> SubCategories { get; set; }
        public DbSet<Centek.Models.RecurringPayment> RecurringPayment { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // 🔹 User – Account (1:N)
            builder.Entity<Account>()
                .HasOne(a => a.User)
                .WithMany(u => u.Accounts)
                .OnDelete(DeleteBehavior.Cascade);

            // 🔹 User – MainCategory (1:N)
            builder.Entity<MainCategory>()
                .HasOne(mc => mc.User)
                .WithMany(u => u.MainCategories)
                .OnDelete(DeleteBehavior.Cascade);

            // 🔹 MainCategory – SubCategory (1:N)
            builder.Entity<SubCategory>()
                .HasOne(sc => sc.MainCategory)
                .WithMany(mc => mc.SubCategories)
                .OnDelete(DeleteBehavior.Cascade);

            // 🔹 Payment – Account (1:N)
            builder.Entity<Payment>()
                .HasOne(p => p.Account)
                .WithMany(a => a.Payments)
                .OnDelete(DeleteBehavior.Cascade);

            // 🔹 RecurringPayment – Account (1:N)
            builder.Entity<RecurringPayment>()
                .HasOne(rp => rp.Account)
                .WithMany(a => a.RecurringPayments)
                .OnDelete(DeleteBehavior.Cascade);

            // 💾 Seed začetnih podatkov
            var user = new User
            {
                Id = "seed-user-id",
                UserName = "demo@centek.com",
                NormalizedUserName = "DEMO@CENTEK.COM",
                Email = "demo@centek.com",
                NormalizedEmail = "DEMO@CENTEK.COM",
                EmailConfirmed = true,
                Name = "Demo",
                Surname = "User",
                SecurityStamp = Guid.NewGuid().ToString("D"),
                PasswordHash = new PasswordHasher<User>().HashPassword(null!, "Demo123!")
            };

            builder.Entity<User>().HasData(user);

            builder.Entity<Account>().HasData(
                new { ID = 1, Name = "Glavni račun", UserId = "seed-user-id" }
            );

            builder.Entity<MainCategory>().HasData(
                new MainCategory
        {
            ID = 1,
            Name = "Hrana",
            UserId = "test-user-id" // <--- KLJUČNO
        },
        new MainCategory
        {
            ID = 2,
            Name = "Transport",
            UserId = "test-user-id"
        }
            );

            builder.Entity<SubCategory>().HasData(
                new SubCategory { ID = 1, Name = "Trgovina", MainCategory = null!, MainCategoryId = 1, Payment = null! },
                new SubCategory { ID = 2, Name = "Restavracije", MainCategory = null!, MainCategoryId = 1, Payment = null! }
            );

            builder.Entity<Payment>().HasData(
                new Payment
                {
                    ID = 1,
                    Name = "Nakup v trgovini",
                    Note = "Mleko in kruh",
                    Type = true,
                    Value = 12.5f,
                    Date = DateTime.Now,
                    Account = null!,
                    AccountId = 1,
                    MainCategoryId = 1
                }
            );
        }
    }
}
