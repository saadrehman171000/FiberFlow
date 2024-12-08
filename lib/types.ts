export type Size = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type SizeQuantity = { [key in Size]?: number };

export interface Product {
    id: number;
    name: string;
    style: string;
    fabric: string;
    vendor: string;
    sizeQuantities: SizeQuantity;
    poDate: string;
    image: string | null;
}
