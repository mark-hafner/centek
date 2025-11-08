using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Centek.Models
{
    public class User: IdentityUser
    {
        public required string Name { get; set; }
        public string? Surname { get; set; }

        public ICollection<Account>? Accounts { get; set; }
        public ICollection<MainCategory> MainCategories { get; set; } = new List<MainCategory>();
    }
}
