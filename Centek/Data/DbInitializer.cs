using System;
using System.Linq;
using Centek.Models;

namespace Centek.Data
{
    public static class DbInitializer
    {
        public static void Initialize(CentekContext context)
        {
            context.Database.EnsureCreated();

            // Če so že podatki, ne delamo nič
            if (context.Users.Any())
            {
                return;
            }

            // Uporabniki
            var users = new User[]
            {
                new User
                {
                    // Username = "asmith",
                    // Password = "pass123",
                    Name = "John",
                    Surname = "Doe",
                },
                new User
                {
                    // Username = "bnasmith",
                    // Password = "secret",
                    Name = "Alice",
                    Surname = "Smith",
                },
            };
            foreach (var u in users)
            {
                context.Users.Add(u);
            }
            context.SaveChanges();

            // Računi
            var accounts = new Account[]
            {
                new Account { Name = "Main Account", User = users[0] },
                new Account { Name = "Savings", User = users[1] },
            };
            foreach (var a in accounts)
            {
                context.Accounts.Add(a);
            }
            context.SaveChanges();

            // Glavne kategorije
            var mainCategories = new MainCategory[]
            {
                new MainCategory { Name = "Food", User = users[0] },
                new MainCategory { Name = "Utilities", User = users[1] },
            };
            foreach (var mc in mainCategories)
            {
                context.MainCategories.Add(mc);
            }
            context.SaveChanges();

            // Podkategorije
            var subCategories = new SubCategory[]
            {
                new SubCategory { Name = "Groceries", MainCategory = mainCategories[0] },
                new SubCategory { Name = "Electricity", MainCategory = mainCategories[1] },
            };
            foreach (var sc in subCategories)
            {
                context.SubCategories.Add(sc);
            }
            context.SaveChanges();

            // Plačila
            var payments = new Payment[]
            {
                new Payment
                {
                    Name = "Supermarket",
                    Note = "Weekly shopping",
                    Type = true,
                    Value = 75.5f,
                    Date = DateTime.Now,
                    Account = accounts[0],
                    MainCategory = mainCategories[0],
                    SubCategory = subCategories[0],
                },
                new Payment
                {
                    Name = "Electric bill",
                    Note = "Monthly",
                    Type = false,
                    Value = 120.0f,
                    Date = DateTime.Now,
                    Account = accounts[1],
                    MainCategory = mainCategories[1],
                    SubCategory = subCategories[1],
                },
            };
            foreach (var p in payments)
            {
                context.Payments.Add(p);
            }
            context.SaveChanges();
        }
    }
}
