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
                    username = "asmith",
                    password = "pass123",
                    name = "John",
                    surname = "Doe",
                },
                new User
                {
                    username = "asmith",
                    password = "secret",
                    name = "Alice",
                    surname = "Smith",
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
                new Account { name = "Main Account", User = users[0] },
                new Account { name = "Savings", User = users[1] },
            };
            foreach (var a in accounts)
            {
                context.Accounts.Add(a);
            }
            context.SaveChanges();

            // Glavne kategorije
            var mainCategories = new MainCategory[]
            {
                new MainCategory { name = "Food", User = users[0] },
                new MainCategory { name = "Utilities", User = users[1] },
            };
            foreach (var mc in mainCategories)
            {
                context.MainCategories.Add(mc);
            }
            context.SaveChanges();

            // Podkategorije
            var subCategories = new SubCategory[]
            {
                new SubCategory { name = "Groceries", MainCategory = mainCategories[0] },
                new SubCategory { name = "Electricity", MainCategory = mainCategories[1] },
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
                    name = "Supermarket",
                    note = "Weekly shopping",
                    type = true,
                    value = 75.5f,
                    date = DateTime.Now,
                    Account = accounts[0],
                    MainCategory = mainCategories[0],
                    SubCategory = subCategories[0],
                },
                new Payment
                {
                    name = "Electric bill",
                    note = "Monthly",
                    type = false,
                    value = 120.0f,
                    date = DateTime.Now,
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
