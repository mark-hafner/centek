namespace Centek.Models.ViewModels
{
    //join both categories together for display on page
    public class PaymentsViewModel
    {
        public List<Payment> Payments { get; set; } = new();
        public List<RecurringPayment> RecurringPayments { get; set; } = new();
    }

}
