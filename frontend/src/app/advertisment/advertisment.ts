export interface Advertisment {
    id: number;
    product: Object;
    createdAt?: Date;
    price: number;
    description: string;
    clicks: number;
    lasModified?: Date;
}
