-- Complete E-commerce Schema for Dropshipping Storefront

-- ─────────────────────────────────────────────
-- SUPPLIERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS suppliers (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                text NOT NULL,
  type                text NOT NULL DEFAULT 'aliexpress' CHECK (type IN ('aliexpress', 'cj_dropshipping', 'spocket', 'printful', 'zendrop', 'autods', 'worldwide_brands', 'crypto_supplier', 'custom')),
  api_key             text,
  api_secret          text,
  is_active           boolean NOT NULL DEFAULT true,
  last_sync_at        timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_suppliers_type ON suppliers(type);
CREATE INDEX IF NOT EXISTS idx_suppliers_active ON suppliers(is_active);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_suppliers" ON suppliers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_suppliers" ON suppliers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_suppliers" ON suppliers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_suppliers" ON suppliers FOR DELETE TO anon, authenticated USING (true);

-- ─────────────────────────────────────────────
-- SUPPLIER PRODUCTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS supplier_products (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id         uuid NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  external_id         text NOT NULL,
  title               text NOT NULL,
  description         text,
  supplier_price      decimal(12,2) NOT NULL,
  retail_price        decimal(12,2),
  images              text[] NOT NULL DEFAULT '{}',
  variants            jsonb NOT NULL DEFAULT '[]',
  inventory_count     integer NOT NULL DEFAULT 0,
  category            text,
  shipping_time       text,
  origin_country      text,
  weight_kg           decimal(8,3),
  is_available        boolean NOT NULL DEFAULT true,
  is_imported         boolean NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_supplier_products_supplier ON supplier_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_category ON supplier_products(category);
CREATE INDEX IF NOT EXISTS idx_supplier_products_external ON supplier_products(external_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_supplier_products_unique ON supplier_products(supplier_id, external_id);

ALTER TABLE supplier_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_supplier_products" ON supplier_products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_supplier_products" ON supplier_products FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_supplier_products" ON supplier_products FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_supplier_products" ON supplier_products FOR DELETE TO anon, authenticated USING (true);

-- ─────────────────────────────────────────────
-- STOREFRONT PRODUCTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS storefront_products (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type         text NOT NULL DEFAULT 'manual' CHECK (source_type IN ('manual', 'imported')),
  supplier_product_id uuid REFERENCES supplier_products(id) ON DELETE SET NULL,
  title               text NOT NULL,
  description         text,
  category            text,
  price               decimal(12,2) NOT NULL,
  original_price      decimal(12,2),
  cost                decimal(12,2) NOT NULL DEFAULT 0,
  images              text[] NOT NULL DEFAULT '{}',
  variants            jsonb NOT NULL DEFAULT '[]',
  inventory           integer NOT NULL DEFAULT 0,
  sku                 text,
  weight_kg           decimal(8,3),
  is_active           boolean NOT NULL DEFAULT true,
  is_featured         boolean NOT NULL DEFAULT false,
  is_manual           boolean NOT NULL DEFAULT false,
  metadata            jsonb NOT NULL DEFAULT '{}',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_storefront_products_category ON storefront_products(category);
CREATE INDEX IF NOT EXISTS idx_storefront_products_active ON storefront_products(is_active);
CREATE INDEX IF NOT EXISTS idx_storefront_products_featured ON storefront_products(is_featured);
CREATE INDEX IF NOT EXISTS idx_storefront_products_source ON storefront_products(source_type);
CREATE UNIQUE INDEX IF NOT EXISTS idx_storefront_unique_supplier_product ON storefront_products(supplier_product_id) WHERE supplier_product_id IS NOT NULL;

ALTER TABLE storefront_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_storefront" ON storefront_products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_storefront" ON storefront_products FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_storefront" ON storefront_products FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_storefront" ON storefront_products FOR DELETE TO anon, authenticated USING (true);

-- ─────────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email      text,
  customer_name       text,
  total               decimal(12,2) NOT NULL,
  status              text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  items               jsonb NOT NULL DEFAULT '[]',
  shipping_address    jsonb,
  payment_method      text,
  payment_status      text DEFAULT 'pending',
  notes               text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_orders" ON orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE TO anon, authenticated USING (true);

-- ─────────────────────────────────────────────
-- DROPSHIP FULFILLMENTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dropship_fulfillments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  supplier_id         uuid NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  status              text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'shipped', 'delivered', 'cancelled')),
  supplier_order_id   text,
  tracking_number     text,
  tracking_url        text,
  items               jsonb NOT NULL DEFAULT '[]',
  submitted_at       timestamptz,
  shipped_at          timestamptz,
  delivered_at        timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fulfillments_order ON dropship_fulfillments(order_id);
CREATE INDEX IF NOT EXISTS idx_fulfillments_supplier ON dropship_fulfillments(supplier_id);
CREATE INDEX IF NOT EXISTS idx_fulfillments_status ON dropship_fulfillments(status);

ALTER TABLE dropship_fulfillments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_fulfillments" ON dropship_fulfillments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_fulfillments" ON dropship_fulfillments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_fulfillments" ON dropship_fulfillments FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_fulfillments" ON dropship_fulfillments FOR DELETE TO anon, authenticated USING (true);