namespace Centek.Models;

public class MainCategoryCreateRequest
{
    public int ID { get; set; }
    public required string Name { get; set; }

    public ICollection<int>? SubCategoriesIds { get; set; }
}