namespace Centek.Models
{
    public class Payment
    {
        public int ID { get; set; }
        public string? name { get; set; }
        public string? note { get; set; }
        public bool type { get; set; }
        public float value { get; set; }
        public DateTime date { get; set; }

        public Account Account { get; set; }
        public int? MainCategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public MainCategory? MainCategory { get; set; }
        public SubCategory? SubCategory { get; set; }
    }
}