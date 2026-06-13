import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ok = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const err = (message: string, status = 400) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// ─── Crypto config ────────────────────────────────────────────────────────────

const CRYPTO_CONFIG: Record<string, {
  network: string;
  required_confirmations: number;
  expiry_minutes: number;
  demo_rate: number;
}> = {
  BTC:  { network: "mainnet",  required_confirmations: 3,  expiry_minutes: 20, demo_rate: 65000 },
  ETH:  { network: "mainnet",  required_confirmations: 12, expiry_minutes: 15, demo_rate: 3200  },
  USDC: { network: "polygon",  required_confirmations: 20, expiry_minutes: 30, demo_rate: 1     },
  USDT: { network: "tron",     required_confirmations: 20, expiry_minutes: 30, demo_rate: 1     },
  BNB:  { network: "bsc",      required_confirmations: 15, expiry_minutes: 15, demo_rate: 580   },
  SOL:  { network: "solana",   required_confirmations: 32, expiry_minutes: 15, demo_rate: 155   },
  LTC:  { network: "litecoin", required_confirmations: 6,  expiry_minutes: 30, demo_rate: 80    },
  DOGE: { network: "mainnet",  required_confirmations: 6,  expiry_minutes: 30, demo_rate: 0.16  },
  XRP:  { network: "mainnet",  required_confirmations: 1,  expiry_minutes: 15, demo_rate: 0.55  },
};

const DEMO_WALLETS: Record<string, string> = {
  BTC:  "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  ETH:  "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  USDC: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  USDT: "TN3W4H6rK2ce4vX9YnFQHwKx7NZaAjkXX1",
  BNB:  "bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2",
  SOL:  "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
  LTC:  "ltc1qhkgq8stt4q7t5zx2rsnw6gltnx2k4xfzwz7h3",
  DOGE: "DRNBkCHRy7XJbHBYyRcHjhGCBzHdAkHhgM",
  XRP:  "rN7n3473SaZBCG4dFL83w7PB5AMxZcioib",
};

// ─── Live rate fetching ───────────────────────────────────────────────────────

const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin", ETH: "ethereum", USDC: "usd-coin", USDT: "tether",
  BNB: "binancecoin", SOL: "solana", LTC: "litecoin", DOGE: "dogecoin", XRP: "ripple",
};

async function getExchangeRate(currency: string): Promise<number> {
  try {
    const id = COINGECKO_IDS[currency];
    if (!id) return CRYPTO_CONFIG[currency]?.demo_rate ?? 1;

    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) throw new Error("rate fetch failed");
    const json = await res.json();
    return json[id]?.usd ?? CRYPTO_CONFIG[currency].demo_rate;
  } catch {
    return CRYPTO_CONFIG[currency]?.demo_rate ?? 1;
  }
}

// ─── Router ──────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/crypto-payment/, "");
    const method = req.method;

    // GET /rates
    if (method === "GET" && path === "/rates") {
      const rates: Record<string, number> = {};
      await Promise.all(
        Object.keys(CRYPTO_CONFIG).map(async (cur) => {
          rates[cur] = await getExchangeRate(cur);
        })
      );
      return ok({ rates, updated_at: new Date().toISOString() });
    }

    // POST /create
    if (method === "POST" && path === "/create") {
      const { order_id, currency, amount_usd } = await req.json();

      if (!order_id || !currency || !amount_usd) {
        return err("order_id, currency, and amount_usd are required");
      }
      if (!CRYPTO_CONFIG[currency]) {
        return err(`Unsupported currency: ${currency}. Supported: ${Object.keys(CRYPTO_CONFIG).join(", ")}`);
      }

      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .select("id, total, status")
        .eq("id", order_id)
        .maybeSingle();

      if (orderErr || !order) return err("Order not found", 404);

      const cfg = CRYPTO_CONFIG[currency];
      const rate = await getExchangeRate(currency);
      const amount_crypto = parseFloat((amount_usd / rate).toFixed(8));
      const wallet_address = DEMO_WALLETS[currency];
      const expires_at = new Date(Date.now() + cfg.expiry_minutes * 60 * 1000).toISOString();

      const payment_uri = currency === "BTC"
        ? `bitcoin:${wallet_address}?amount=${amount_crypto}&label=AbundantMerchandise&message=Order+${order_id}`
        : currency === "ETH" || currency === "USDC" || currency === "USDT"
        ? `ethereum:${wallet_address}?value=${amount_crypto}`
        : `${currency.toLowerCase()}:${wallet_address}?amount=${amount_crypto}`;

      const { data: payment, error: payErr } = await supabase
        .from("crypto_payments")
        .insert({
          order_id,
          currency,
          network: cfg.network,
          amount_crypto,
          amount_usd,
          exchange_rate: rate,
          wallet_address,
          payment_uri,
          required_confirmations: cfg.required_confirmations,
          status: "pending",
          provider: "manual",
          expires_at,
        })
        .select()
        .single();

      if (payErr) return err(payErr.message, 500);

      await supabase
        .from("orders")
        .update({ payment_method: "crypto", updated_at: new Date().toISOString() })
        .eq("id", order_id);

      return ok(payment, 201);
    }

    // GET /status/:paymentId
    if (method === "GET" && path.startsWith("/status/")) {
      const paymentId = path.split("/")[2];
      const { data: payment, error: payErr } = await supabase
        .from("crypto_payments")
        .select("*")
        .eq("id", paymentId)
        .maybeSingle();

      if (payErr || !payment) return err("Payment not found", 404);

      if (payment.status === "pending" && new Date(payment.expires_at) < new Date()) {
        const { data: updated } = await supabase
          .from("crypto_payments")
          .update({ status: "expired", updated_at: new Date().toISOString() })
          .eq("id", paymentId)
          .select()
          .single();
        return ok(updated ?? payment);
      }

      return ok(payment);
    }

    // POST /confirm/:paymentId
    if (method === "POST" && path.startsWith("/confirm/")) {
      const paymentId = path.split("/")[2];
      const { tx_hash, confirmations } = await req.json().catch(() => ({}));

      const { data: payment, error: payErr } = await supabase
        .from("crypto_payments")
        .select("*")
        .eq("id", paymentId)
        .maybeSingle();

      if (payErr || !payment) return err("Payment not found", 404);

      const newConfs = confirmations ?? payment.confirmations + 1;
      const isConfirmed = newConfs >= payment.required_confirmations;

      const { data: updated, error: updateErr } = await supabase
        .from("crypto_payments")
        .update({
          tx_hash: tx_hash ?? payment.tx_hash,
          confirmations: newConfs,
          status: isConfirmed ? "confirmed" : "confirming",
          confirmed_at: isConfirmed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", paymentId)
        .select()
        .single();

      if (updateErr) return err(updateErr.message, 500);

      if (isConfirmed) {
        await supabase
          .from("orders")
          .update({ status: "paid", payment_status: "paid", updated_at: new Date().toISOString() })
          .eq("id", payment.order_id);
      }

      return ok(updated);
    }

    // GET /payments
    if (method === "GET" && path === "/payments") {
      const status = url.searchParams.get("status");
      let query = supabase
        .from("crypto_payments")
        .select("*, orders(customer_name, customer_email, total)")
        .order("created_at", { ascending: false });
      if (status) query = query.eq("status", status);
      const { data, error } = await query;
      if (error) return err(error.message, 500);
      return ok(data);
    }

    return err("Route not found", 404);
  } catch (e) {
    return err(e instanceof Error ? e.message : "Internal error", 500);
  }
});
