export type TransactionType = "income" | "expense";

export type StockMovementType = "in" | "out" | "adjustment";

export type Business = {
  id: string;
  owner_id: string;
  name: string;
  business_type: string;
  currency: string;
  location?: string | null;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  business_id: string;
  name: string;
  type: TransactionType;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  business_id: string;
  category_id?: string | null;
  type: TransactionType;
  amount: number;
  description?: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  business_id: string;
  name: string;
  sku?: string | null;
  cost_price: number;
  selling_price: number;
  current_stock: number;
  minimum_stock: number;
  created_at: string;
  updated_at: string;
};

export type StockMovement = {
  id: string;
  business_id: string;
  product_id: string;
  type: StockMovementType;
  quantity: number;
  note?: string | null;
  created_at: string;
};