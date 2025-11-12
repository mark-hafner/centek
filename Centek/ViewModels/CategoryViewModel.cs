namespace Centek.Models.ViewModels
{
    //join both categories together for display on page
    public class CategoryViewModel
    {
        public IEnumerable<MainCategory> MainCategories { get; set; } = new List<MainCategory>();
        public IEnumerable<SubCategory> SubCategories { get; set; } = new List<SubCategory>();
    }

}
