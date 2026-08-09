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
  original_price: number | null;
  material_label: string | null;
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
      newsletter_signups: {
        Row: { id: string; email: string; created_at: string };
        Insert: { email: string };
        Update: { email?: string };
      };
    };
    Functions: {
      track_order: {
        Args: { p_phone: string; p_email: string };
        Returns: {
          id: string;
          product_name: string | null;
          total_amount: number;
          payment_status: string;
          created_at: string;
        }[];
      };
    };
  };
}