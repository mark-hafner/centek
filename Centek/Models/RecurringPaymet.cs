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
        public string? Name { get; set; }
        public string? Mote { get; set; }
        public bool Type { get; set; }
        public float Value { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Frequency RecFrequency { get; set; }
        public int RecInterval { get; set; }

        public required Account Account { get; set; }
        public int? MainCategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public MainCategory? MainCategory { get; set; }
        public SubCategory? SubCategory { get; set; }
    }
}
