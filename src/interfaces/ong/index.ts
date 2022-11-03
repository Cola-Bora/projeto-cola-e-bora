export interface IOngRequest{
    name: string;
    email: string;
    tel: string;
    description: string;
    cnpj: string;
    categoryId: string;
}

export interface IOng{
    id: string;
    name: string;
    email: string;
    tel: string;
    description: string;
    cnpj: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    categoryId: string;
}


export interface IOngUpdate{
    name?: string;
    email?: string;
    tel?: string;
    description?: string;
    cnpj?: string;
}
