namespace Centek.Models
{
    public class Account
    {
        public int ID { get; set; }
        public required string Name { get; set; }

        public required User User { get; set; }
        public ICollection<Payment>? Payments { get; set; }
        public ICollection<RecurringPayment>? RecurringPayments { get; set; }
    }
}
