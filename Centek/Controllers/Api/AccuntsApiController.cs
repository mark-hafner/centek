using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Centek.Data;
using Centek.Models;
using Centek.Services;
using Centek.Filters;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Centek.Controllers_Apigi
{
    [Route("api/v1/accounts")]
    [ApiController]
    [ApiKeyAuth]
    public class AccuntsApiController : ControllerBase
    {
        private readonly CentekContext _context;
        private readonly AccountService _accountService;

        public AccuntsApiController(CentekContext context, AccountService accountService)
        {
            _context = context;
            _accountService = accountService;
        }

        // GET: api/AccuntsApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Account>>> GetAccounts()
        {
            var userId = HttpContext.Request.Headers["UserId"].ToString();

            var userAccount = await _context.Accounts.Where(a => a.UserId == userId).ToListAsync();
            return userAccount;
        }

        // GET: api/AccuntsApi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Account>> GetAccount(int id)
        {
            var account = await _context.Accounts.FindAsync(id);

            if (account == null)
            {
                return NotFound();
            }

            return account;
        }

        // PUT: api/AccuntsApi/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAccount(int id, Account account)
        {
            if (id != account.ID)
            {
                return BadRequest();
            }

            _context.Entry(account).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                await _accountService.InvalidateAsync(HttpContext.Request.Headers["UserId"].ToString());
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AccountExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/AccuntsApi
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("createAccount")]
        public async Task<ActionResult<Account>> PostAccount(
            [FromBody] AccountCreateRequest request
        )
        {
            var account = new Account
            {
                Name = request.Name,
                UserId = HttpContext.Request.Headers["UserId"].ToString(),
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();
            await _accountService.InvalidateAsync(HttpContext.Request.Headers["UserId"].ToString());

            return CreatedAtAction("GetAccount", new { id = account.ID }, account);
        }

        // DELETE: api/AccuntsApi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            var account = await _context.Accounts.FindAsync(id);
            if (account == null)
            {
                return NotFound();
            }

            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();
            await _accountService.InvalidateAsync(HttpContext.Request.Headers["UserId"].ToString());

            return NoContent();
        }

        private bool AccountExists(int id)
        {
            return _context.Accounts.Any(e => e.ID == id);
        }
    }
}
