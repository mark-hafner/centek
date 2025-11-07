namespace Centek.Models
{
    public class Account
    {
        public int ID { get; set; }
        public string Name { get; set; }

        public User User { get; set; }
        public ICollection<Payment> Payments { get; set; }
    }
}