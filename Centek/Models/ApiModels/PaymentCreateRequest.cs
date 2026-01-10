namespace Centek.Models
{
    public class PaymentCreateRequest
    {
        public int ID { get; set; }

        public required string Name { get; set; }

        public string? Note { get; set; }

        public bool Type { get; set; }

        public decimal Amount { get; set; }

        public DateTime? Date { get; set; }

        public int AccountId { get; set; }
        public int? MainCategoryId { get; set; }
        public int? SubCategoryId { get; set; }
    }
}
