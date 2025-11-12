namespace Centek.Models
{
    public class Payment
    {
        public int ID { get; set; }
        public string? Name { get; set; }
        public string? Note { get; set; }
        public bool Type { get; set; }
        public float Value { get; set; }
        public DateTime Date { get; set; }

        public int? AccountId { get; set; }
        public Account? Account { get; set; }
        public int? MainCategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public MainCategory? MainCategory { get; set; }
        public SubCategory? SubCategory { get; set; }
    }
}
