using Centek.Models;
using Microsoft.EntityFrameworkCore;

namespace Centek.Data
{
    public class CentekContext : DbContext
    {
        public CentekContext(DbContextOptions<CentekContext> options) : base(options)
        {
        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<MainCategory> MainCategories { get; set; }
        public DbSet<SubCategory> SubCategories { get; set; }
        }
}