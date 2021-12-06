export interface Advertisment {
    id: number;
    product: number;
    createdAt?: Date;
    price: number;
    description: string;
    clicks: number;
    lasModified?: Date;
}
