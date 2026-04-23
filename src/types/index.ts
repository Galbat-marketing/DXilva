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
  stock_quantity: number;
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

export interface DiscountCode {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_amount?: number;
  usage_limit?: number;
  usage_count: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

export interface AppliedDiscount {
  code: DiscountCode;
  discount_amount: number;
}

export interface CartStateWithDiscount extends CartState {
  discount?: AppliedDiscount;
  discountedTotal: number;
}
