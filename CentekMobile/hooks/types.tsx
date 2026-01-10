// INTERFACES
interface MainDataInterface {
    id: number
    name: string
}
export interface Overview extends MainDataInterface { }
export interface Account extends MainDataInterface { }
export interface MainCategory extends MainDataInterface { }
export interface SubCategory extends MainCategory {
    mainCategoryId: number
}
export interface Payment extends MainDataInterface {
    note: string
    type: Boolean
    amount: number
    date: Date
    account: Account | null
    accountId: number
    mainCategory: MainCategory | null
    mainCategoryId: number
    subCategory: SubCategory | null
    subCategoryId: number
}
export interface Stats {
    total: number
    payments: Payment[]
    accounts: Account[]
    mainCategories: MainCategory[]
    subCategories: SubCategory[]
}