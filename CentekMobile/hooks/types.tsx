// INTERFACES
interface MainDataInterface {
    id: Number
    name: String
}
export interface Overview extends MainDataInterface { }
export interface Account extends MainDataInterface { }
export interface MainCategory extends MainDataInterface { }
export interface SubCategory extends MainCategory {
    mainCategoryId: String
}
export interface Payment extends MainDataInterface {
    note: String
    type: Boolean
    amount: Number
    date: Date
    accountId: Number
    MainCategoryId: Number
    SubCategoryId: Number
}
export interface Stats {
    total: Number
    // payments: Payment[],

}