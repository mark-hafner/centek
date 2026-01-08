export type paymentPostRequest = {
    Name: string,
    note?: string,
    Type: boolean,
    Amount: number,
    Date: string,
    AccountId: number,
    MainCategoryId?: number,
    SubCategoryId?: number
};