namespace Centek.Models
{
    public class RecurringPayment
    {
        public enum Frequency
        {
            daily,
            weekly,
            monthly,
            yearly,
        }

        public int ID { get; set; }
        public string? name { get; set; }
        public string? note { get; set; }
        public bool type { get; set; }
        public float value { get; set; }
        public DateTime startDate { get; set; }
        public DateTime? endDate { get; set; }
        public Frequency frequency { get; set; }
        public int interval { get; set; }

        public required Account Account { get; set; }
        public int? MainCategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public MainCategory? MainCategory { get; set; }
        public SubCategory? SubCategory { get; set; }
    }
}
