using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Centek.Models
{
    public class User
    {
        [Key]
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required string Name { get; set; }
        public string? Surname { get; set; }

        public ICollection<Account>? Accounts { get; set; }
        public ICollection<MainCategory> MainCategories { get; set; } = new List<MainCategory>();
    }
}
