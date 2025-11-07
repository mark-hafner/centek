namespace Centek.Models
{
    public class SubCategory
    {
        public int ID { get; set; }
        public string Name { get; set; }

        public MainCategory MainCategory { get; set; }
        public Payment Payment { get; set; }
    }
}
