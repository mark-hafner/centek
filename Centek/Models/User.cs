namespace Centek.Models
{
    public class User
    {
        public int ID { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string name { get; set; }
        public string? surname { get; set; }

        public ICollection<Account> Accounts { get; set; }
        public ICollection<MainCategory> MainCategories { get; set; }
    }
}