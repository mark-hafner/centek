using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Centek.Models
{
    public class User
    {
        [Key]
        public required string username { get; set; }
        public required string password { get; set; }
        public required string name { get; set; }
        public string? surname { get; set; }

        public ICollection<Account>? Accounts { get; set; }
        public ICollection<MainCategory> MainCategories { get; set; }
    }
}
