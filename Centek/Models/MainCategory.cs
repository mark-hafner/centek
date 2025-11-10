using Centek.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Centek.Models
{
    public class MainCategory
    {
        public int ID { get; set; }
        public required string Name { get; set; }

        public string? UserId { get; set; }
        public User? User { get; set; }
        public ICollection<Payment>? Payments { get; set; }
        public ICollection<SubCategory>? SubCategories { get; set; }
    }
}