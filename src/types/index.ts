export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_price?: number;
  currency: string;
  thumbnail_url: string;
  is_active: boolean;
  category_id?: string;
}

export interface CartItem {
  id: string;             // UID del item en el cart
  product_id: string;     // UID del producto real
  product: Product;       // Copia o referencia del producto en sí
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  total: number;
}
