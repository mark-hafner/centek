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

export type accountPostRequest = {
    Name: string,
    MainCategoryId?: number,
    SubCategoryId?: number
};

export type mainCategoryPostRequest = {
    Name: string,
};

export type subCategoryPostRequest = {
    Name: string,
    MainCategoryId?: number,
};