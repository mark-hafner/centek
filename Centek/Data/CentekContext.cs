using Centek.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

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
        public DbSet<RecurringPayment> RecurringPayment { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Account → Payment
            modelBuilder
                .Entity<Payment>()
                .HasOne(p => p.Account)
                .WithMany(a => a.Payments)
                .HasForeignKey(p => p.AccountId)
                .IsRequired();

            // MainCategory → User
            modelBuilder
                .Entity<MainCategory>()
                .HasOne(mc => mc.User)
                .WithMany(u => u.MainCategories)
                .HasForeignKey(mc => mc.UserId)
                .IsRequired();

            // SubCategory → MainCategory
            modelBuilder
                .Entity<SubCategory>()
                .HasOne(sc => sc.MainCategory)
                .WithMany(mc => mc.SubCategories)
                .IsRequired(false);

            // Payment → MainCategory / SubCategory
            modelBuilder
                .Entity<Payment>()
                .HasOne(p => p.MainCategory)
                .WithMany(mc => mc.Payments)
                .HasForeignKey(p => p.MainCategoryId)
                .IsRequired(false);

            modelBuilder
                .Entity<Payment>()
                .HasOne(p => p.SubCategory)
                .WithMany(sc => sc.Payments)
                .HasForeignKey(p => p.SubCategoryId)
                .IsRequired(false);

            // RecurringPayment → Account, MainCategory, SubCategory
            modelBuilder
                .Entity<RecurringPayment>()
                .HasOne(rp => rp.Account)
                .WithMany(a => a.RecurringPayments)
                .IsRequired();

            modelBuilder
                .Entity<RecurringPayment>()
                .HasOne(rp => rp.MainCategory)
                .WithMany()
                .IsRequired(false);

            modelBuilder
                .Entity<RecurringPayment>()
                .HasOne(rp => rp.SubCategory)
                .WithMany()
                .IsRequired(false);
        }
    }
}
