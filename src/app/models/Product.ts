import { ProductCategory } from './ProductCategory';

export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  status: string;
  category: ProductCategory;
}
