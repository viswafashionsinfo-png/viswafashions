// Hand-written types that mirror supabase/schema.sql + add-columns.sql.

export interface Category {
  id: string;
  name: string;
  image_url: string | null;
  display_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null; // optional — set higher than price for a discount badge
  material_label: string | null; // optional — e.g. "Pure Kanjivaram Silk"
  image_url: string | null;
  category_id: string | null;
  badge: string | null;
  in_stock: boolean;
  display_order: number;
  created_at: string;
}

export interface OrderInsert {
  full_name: string;
  email: string;
  phone_number: string;
  pincode: string;
  area: string;
  city: string;
  state: string;
  complete_address: string;
  product_id: string;
  total_amount: number;
  payment_status: string;
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Partial<Category>;
        Update: Partial<Category>;
      };
      products: {
        Row: Product;
        Insert: Partial<Product>;
        Update: Partial<Product>;
      };
      orders: {
        Row: OrderInsert & { id: string; created_at: string };
        Insert: OrderInsert;
        Update: Partial<OrderInsert>;
      };
    };
  };
}
