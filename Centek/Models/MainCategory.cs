namespace Centek.Models
{
    public class MainCategory
    {
        public int ID { get; set; }
        public string name { get; set; }

        public User User { get; set; }
        public Payment Payment { get; set; }
        public ICollection<SubCategory>? SubCategories { get; set; }
    }
}