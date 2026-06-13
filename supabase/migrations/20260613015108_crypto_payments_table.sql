-- Crypto Payments Table

CREATE TABLE IF NOT EXISTS crypto_payments (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  currency              text NOT NULL,
  network               text NOT NULL,
  amount_crypto         decimal(20,8) NOT NULL,
  amount_usd            decimal(12,2) NOT NULL,
  exchange_rate         decimal(20,4) NOT NULL,
  wallet_address        text NOT NULL,
  payment_uri           text,
  tx_hash               text,
  confirmations         integer NOT NULL DEFAULT 0,
  required_confirmations integer NOT NULL DEFAULT 3,
  status                text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirming', 'confirmed', 'expired', 'failed', 'refunded')),
  provider              text DEFAULT 'manual',
  expires_at            timestamptz NOT NULL,
  confirmed_at          timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crypto_payments_order ON crypto_payments(order_id);
CREATE INDEX IF NOT EXISTS idx_crypto_payments_status ON crypto_payments(status);
CREATE INDEX IF NOT EXISTS idx_crypto_payments_currency ON crypto_payments(currency);

ALTER TABLE crypto_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_crypto_payments" ON crypto_payments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_crypto_payments" ON crypto_payments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_crypto_payments" ON crypto_payments FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_crypto_payments" ON crypto_payments FOR DELETE TO anon, authenticated USING (true);