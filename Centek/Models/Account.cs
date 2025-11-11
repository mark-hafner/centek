namespace Centek.Models
{
    public class Account
    {
        public int ID { get; set; }
        public required string Name { get; set; }

        public string? UserId { get; set; }
        public User? User { get; set; }
        public ICollection<Payment>? Payments { get; set; }
        public ICollection<RecurringPayment>? RecurringPayments { get; set; }
    }
}
