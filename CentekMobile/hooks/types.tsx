// INTERFACES
interface MainDataInterface {
    id: number;
    name: string;
}
export interface Overview extends MainDataInterface { }
export interface Account extends MainDataInterface { }
export interface MainCategory extends MainDataInterface { }
export interface SubCategory extends MainCategory {
    mainCategoryId: string;
}