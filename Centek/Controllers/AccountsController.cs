using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Centek.Data;
using Centek.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace Centek.Controllers
{
    [Authorize]
    public class AccountsController : Controller
    {
        private readonly CentekContext _context;
        private readonly UserManager<User> _userManager;

        public AccountsController(CentekContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: Accounts
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            // get user specific accounts
            var user = await _userManager.GetUserAsync(User);

            // Get Accounts for this user
            var accounts = await _context.Accounts.Where(a => a.UserId == user.Id).ToListAsync();

            return View(accounts);
        }

        // GET: Accounts/Details/5
        [HttpGet]
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var user = await _userManager.GetUserAsync(User); //get current user
            // show only accounts from current user
            var account = await _context.Accounts.FirstOrDefaultAsync(a =>
                a.ID == id && a.UserId == user.Id
            );
            if (account == null)
            {
                return NotFound();
            }

            return View(account);
        }

        // GET: Accounts/Create
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // POST: Accounts/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Account account, decimal initialBalance)
        {
            var user = await _userManager.GetUserAsync(User); //get current user

            account.UserId = user.Id;
            account.User = user;
            if (ModelState.IsValid)
            {
                _context.Add(account);
                await _context.SaveChangesAsync();

                var initialPayment = new Payment
                {
                    Name = "Initial Balance",
                    Note = "Initial payment on account creation",
                    Amount = Math.Abs(initialBalance),
                    Type = initialBalance >= 0,
                    Date = DateTime.Now,
                    AccountId = account.ID
                };

                _context.Payments.Add(initialPayment);
                await _context.SaveChangesAsync();

                return RedirectToAction(nameof(Index));
            }
            return View(account);
        }

        // GET: Accounts/Edit/5
        [HttpGet]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var user = await _userManager.GetUserAsync(User); //get current user
            // show only accounts from current user
            var account = await _context.Accounts.FirstOrDefaultAsync(a =>
                a.ID == id && a.UserId == user.Id
            );
            if (account == null)
            {
                return NotFound();
            }
            return View(account);
        }

        // POST: Accounts/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Account updatedAccount)
        {
            var user = await _userManager.GetUserAsync(User); //get current user
            // show only accounts from current user
            var existingAccount = await _context.Accounts.FirstOrDefaultAsync(a =>
                a.ID == id && a.UserId == user.Id
            );

            if (existingAccount == null)
            {
                return NotFound();
            }

            existingAccount.Name = updatedAccount.Name;

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(existingAccount);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AccountExists(existingAccount.ID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(existingAccount);
        }

        // GET: Accounts/Delete/5
        [HttpGet]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var user = await _userManager.GetUserAsync(User); //get current user
            // show only accounts from current user
            var account = await _context.Accounts.FirstOrDefaultAsync(a =>
                a.ID == id && a.UserId == user.Id
            );

            if (account == null)
            {
                return NotFound();
            }

            return View(account);
        }

        // POST: Accounts/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var user = await _userManager.GetUserAsync(User); //get current user
            // show only accounts from current user
            var account = await _context.Accounts.FirstOrDefaultAsync(a =>
                a.ID == id && a.UserId == user.Id
            );

            if (account != null)
            {
                _context.Accounts.Remove(account);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool AccountExists(int id)
        {
            return _context.Accounts.Any(e => e.ID == id);
        }
    }
}
