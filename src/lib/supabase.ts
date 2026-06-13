import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fnUrl = (name: string) => `${supabaseUrl}/functions/v1/${name}`;

export const fnHeaders = () => ({
  Authorization: `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json',
});

// ─── Types ──────────────────────────────────────────────────────────────────

export interface StorefrontProduct {
  id: string;
  source_type: 'manual' | 'imported';
  supplier_product_id: string | null;
  title: string;
  description: string | null;
  category: string | null;
  price: number;
  original_price: number | null;
  cost: number;
  images: string[];
  variants: Array<{ sku: string; option: string; price: number; stock: number }>;
  inventory: number;
  sku: string | null;
  weight_kg: number | null;
  is_active: boolean;
  is_featured: boolean;
  is_manual: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  supplier_products?: {
    title: string;
    external_id: string;
    suppliers?: { name: string; type: string };
  } | null;
}

export type SupplierType =
  | 'aliexpress'
  | 'cj_dropshipping'
  | 'spocket'
  | 'printful'
  | 'zendrop'
  | 'autods'
  | 'worldwide_brands'
  | 'crypto_supplier'
  | 'custom';

export interface Supplier {
  id: string;
  name: string;
  type: SupplierType;
  api_key: string | null;
  api_secret: string | null;
  webhook_url: string | null;
  settings: Record<string, unknown>;
  is_active: boolean;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupplierProduct {
  id: string;
  supplier_id: string;
  external_id: string;
  title: string;
  description: string | null;
  supplier_price: number;
  retail_price: number | null;
  images: string[];
  variants: Array<{ sku: string; option: string; price: number; stock: number }>;
  inventory_count: number;
  category: string | null;
  shipping_time: string | null;
  origin_country: string | null;
  weight_kg: number | null;
  is_available: boolean;
  is_imported: boolean;
  last_synced_at: string;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  items: Array<{
    product_id?: string;
    supplier_product_id?: string;
    title: string;
    quantity: number;
    unit_price: number;
  }>;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_method: 'stripe' | 'paypal' | 'crypto' | 'bank_transfer' | null;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DropshipFulfillment {
  id: string;
  order_id: string;
  supplier_id: string;
  supplier_order_id: string | null;
  items: unknown[];
  cost: number | null;
  status: 'pending' | 'submitted' | 'processing' | 'shipped' | 'delivered' | 'failed' | 'cancelled';
  tracking_number: string | null;
  tracking_url: string | null;
  carrier: string | null;
  notes: string | null;
  submitted_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

export type CryptoCurrency = 'BTC' | 'ETH' | 'USDC' | 'USDT' | 'BNB' | 'SOL' | 'LTC' | 'DOGE' | 'XRP';

export interface CryptoPayment {
  id: string;
  order_id: string;
  currency: CryptoCurrency;
  network: string;
  amount_crypto: number;
  amount_usd: number;
  exchange_rate: number;
  wallet_address: string;
  payment_uri: string | null;
  tx_hash: string | null;
  confirmations: number;
  required_confirmations: number;
  status: 'pending' | 'confirming' | 'confirmed' | 'expired' | 'failed' | 'refunded';
  provider: string | null;
  expires_at: string;
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
}
