namespace Centek.Models
{
    public class AccountCreateRequest
    {
        public int ID { get; set; }
        public required string Name { get; set; }
        // public ICollection<Payment>? Payments { get; set; }
        // public ICollection<RecurringPayment>? RecurringPayments { get; set; }
    }
}
