namespace Centek.Models;

public class SubCategoryCreateRequest
{
    public int ID { get; set; }
    public required string Name { get; set; }

    public int MainCategoryId { get; set; }
}