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

// ─── Mock supplier API response generators ───────────────────────────────────
// In production, replace each case with a real HTTP call to the supplier's API.

function mockProductsForSupplier(type: string, count = 12) {
  const categories: Record<string, string[]> = {
    aliexpress: ["Electronics", "Fashion", "Home & Garden", "Sports"],
    cj_dropshipping: ["Electronics", "Tools", "Pet Supplies", "Toys"],
    spocket: ["Fashion", "Beauty", "Home Decor", "Accessories"],
    printful: ["T-Shirts", "Hoodies", "Mugs", "Posters"],
    zendrop: ["Electronics", "Health", "Kitchen", "Office"],
    autods: ["Electronics", "Gaming", "Sports", "Baby"],
    worldwide_brands: ["Wholesale", "Bulk", "Industrial", "Consumer Goods"],
    crypto_supplier: ["Hardware Wallets", "Mining Gear", "Crypto Merch", "NFT Prints"],
    custom: ["General", "Miscellaneous"],
  };
  const cats = categories[type] || ["General"];

  return Array.from({ length: count }, (_, i) => ({
    external_id: `${type.toUpperCase()}-${100000 + i}`,
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} Product ${i + 1}`,
    description: `High-quality product from ${type} supplier. Ships worldwide.`,
    supplier_price: parseFloat((Math.random() * 45 + 5).toFixed(2)),
    retail_price: parseFloat((Math.random() * 90 + 20).toFixed(2)),
    images: [
      `https://images.pexels.com/photos/${[437037, 3780691, 2529148, 1036808, 788946, 380769][i % 6]}/pexels-photo-${[437037, 3780691, 2529148, 1036808, 788946, 380769][i % 6]}.jpeg?w=400&h=400&fit=crop`,
    ],
    variants: [
      { sku: `${type.toUpperCase()}-${100000 + i}-A`, option: "Default", price: parseFloat((Math.random() * 45 + 5).toFixed(2)), stock: Math.floor(Math.random() * 500 + 10) },
    ],
    inventory_count: Math.floor(Math.random() * 500 + 10),
    category: cats[i % cats.length],
    shipping_time: type === "printful" ? "3-5 business days" : type === "aliexpress" ? "15-30 days" : "7-14 days",
    origin_country: type === "aliexpress" || type === "cj_dropshipping" ? "CN" : type === "printful" ? "US" : "US",
    weight_kg: parseFloat((Math.random() * 2 + 0.1).toFixed(3)),
    is_available: true,
  }));
}

async function syncSupplier(supplierId: string) {
  const { data: supplier, error: supErr } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", supplierId)
    .maybeSingle();

  if (supErr || !supplier) return { error: "Supplier not found" };

  const products = mockProductsForSupplier(supplier.type);

  const rows = products.map((p) => ({ ...p, supplier_id: supplierId }));

  const { error: upsertErr } = await supabase
    .from("supplier_products")
    .upsert(rows, { onConflict: "supplier_id,external_id", ignoreDuplicates: false });

  if (upsertErr) return { error: upsertErr.message };

  await supabase
    .from("suppliers")
    .update({ last_sync_at: new Date().toISOString() })
    .eq("id", supplierId);

  return { synced: rows.length, supplier: supplier.name };
}

async function submitFulfillment(fulfillmentId: string) {
  const { data: fulfillment, error: fErr } = await supabase
    .from("dropship_fulfillments")
    .select("*, suppliers(*), orders(*)")
    .eq("id", fulfillmentId)
    .maybeSingle();

  if (fErr || !fulfillment) return { error: "Fulfillment not found" };

  // Simulate submitting to the supplier API
  const mockSupplierOrderId = `ORD-${fulfillment.suppliers.type.toUpperCase()}-${Date.now()}`;

  const { error: updateErr } = await supabase
    .from("dropship_fulfillments")
    .update({
      status: "submitted",
      supplier_order_id: mockSupplierOrderId,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", fulfillmentId);

  if (updateErr) return { error: updateErr.message };

  await supabase
    .from("orders")
    .update({ status: "processing", updated_at: new Date().toISOString() })
    .eq("id", fulfillment.order_id);

  return { supplier_order_id: mockSupplierOrderId, status: "submitted" };
}

// ─── Router ──────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/dropship-api/, "");
    const method = req.method;

    // ── SUPPLIERS ────────────────────────────────────────────────────────────

    // GET /suppliers — list all suppliers
    if (method === "GET" && path === "/suppliers") {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("created_at");
      if (error) return err(error.message, 500);
      return ok(data);
    }

    // POST /suppliers — create a supplier
    if (method === "POST" && path === "/suppliers") {
      const body = await req.json();
      const { data, error } = await supabase
        .from("suppliers")
        .insert(body)
        .select()
        .single();
      if (error) return err(error.message, 500);
      return ok(data, 201);
    }

    // PUT /suppliers/:id — update a supplier
    if (method === "PUT" && path.startsWith("/suppliers/")) {
      const id = path.split("/")[2];
      const body = await req.json();
      const { data, error } = await supabase
        .from("suppliers")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) return err(error.message, 500);
      return ok(data);
    }

    // DELETE /suppliers/:id
    if (method === "DELETE" && path.startsWith("/suppliers/")) {
      const id = path.split("/")[2];
      const { error } = await supabase.from("suppliers").delete().eq("id", id);
      if (error) return err(error.message, 500);
      return ok({ deleted: id });
    }

    // ── SYNC ────────────────────────────────────────────────────────────────

    // POST /sync/:supplierId — sync products from a supplier
    if (method === "POST" && path.startsWith("/sync/")) {
      const supplierId = path.split("/")[2];
      const result = await syncSupplier(supplierId);
      if (result.error) return err(result.error, 500);
      return ok(result);
    }

    // ── SUPPLIER PRODUCTS ────────────────────────────────────────────────────

    // GET /products — list supplier products with optional filters
    if (method === "GET" && path === "/products") {
      const supplierId = url.searchParams.get("supplier_id");
      const category = url.searchParams.get("category");
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);

      let query = supabase
        .from("supplier_products")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (supplierId) query = query.eq("supplier_id", supplierId);
      if (category) query = query.eq("category", category);

      const { data, error, count } = await query;
      if (error) return err(error.message, 500);
      return ok({ products: data, total: count, page, limit });
    }

    // POST /products/:id/import — mark product as imported to storefront
    if (method === "POST" && path.includes("/import")) {
      const id = path.split("/")[2];
      const body = await req.json().catch(() => ({}));

      // Get the supplier product
      const { data: sp, error: spErr } = await supabase
        .from("supplier_products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (spErr || !sp) return err("Supplier product not found", 404);

      // Create storefront product from supplier product
      const retailPrice = body.retail_price ?? sp.retail_price ?? sp.supplier_price * 1.35;

      const { data: storefront, error: insertErr } = await supabase
        .from("storefront_products")
        .upsert({
          source_type: "imported",
          supplier_product_id: id,
          title: sp.title,
          description: sp.description,
          category: sp.category,
          price: retailPrice,
          original_price: sp.retail_price ?? null,
          cost: sp.supplier_price,
          images: sp.images,
          variants: sp.variants,
          inventory: sp.inventory_count,
          weight_kg: sp.weight_kg,
          is_active: true,
        }, { onConflict: "supplier_product_id" })
        .select()
        .single();

      if (insertErr) return err(insertErr.message, 500);

      // Mark supplier product as imported
      await supabase
        .from("supplier_products")
        .update({ is_imported: true })
        .eq("id", id);

      return ok(storefront);
    }

    // ── ORDERS ──────────────────────────────────────────────────────────────

    // GET /orders — list orders
    if (method === "GET" && path === "/orders") {
      const status = url.searchParams.get("status");
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);

      let query = supabase
        .from("orders")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (status) query = query.eq("status", status);

      const { data, error, count } = await query;
      if (error) return err(error.message, 500);
      return ok({ orders: data, total: count, page, limit });
    }

    // POST /orders — create an order
    if (method === "POST" && path === "/orders") {
      const body = await req.json();
      const { data, error } = await supabase
        .from("orders")
        .insert(body)
        .select()
        .single();
      if (error) return err(error.message, 500);
      return ok(data, 201);
    }

    // ── FULFILLMENTS ────────────────────────────────────────────────────────

    // GET /fulfillments — list fulfillments
    if (method === "GET" && path === "/fulfillments") {
      const orderId = url.searchParams.get("order_id");
      let query = supabase
        .from("dropship_fulfillments")
        .select("*, suppliers(name, type)")
        .order("created_at", { ascending: false });
      if (orderId) query = query.eq("order_id", orderId);
      const { data, error } = await query;
      if (error) return err(error.message, 500);
      return ok(data);
    }

    // POST /fulfillments — create a fulfillment
    if (method === "POST" && path === "/fulfillments") {
      const body = await req.json();
      const { data, error } = await supabase
        .from("dropship_fulfillments")
        .insert(body)
        .select()
        .single();
      if (error) return err(error.message, 500);
      return ok(data, 201);
    }

    // POST /fulfillments/:id/submit — submit fulfillment to supplier
    if (method === "POST" && path.includes("/submit")) {
      const id = path.split("/")[2];
      const result = await submitFulfillment(id);
      if (result.error) return err(result.error, 500);
      return ok(result);
    }

    // PUT /fulfillments/:id — update fulfillment (tracking, status, etc.)
    if (method === "PUT" && path.startsWith("/fulfillments/")) {
      const id = path.split("/")[2];
      const body = await req.json();
      const { data, error } = await supabase
        .from("dropship_fulfillments")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) return err(error.message, 500);
      return ok(data);
    }

    // ── STOREFRONT PRODUCTS ────────────────────────────────────────────────

    // GET /storefront — list all storefront products (manual + imported)
    if (method === "GET" && path === "/storefront") {
      const source = url.searchParams.get("source");
      const category = url.searchParams.get("category");
      const isActive = url.searchParams.get("is_active");
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);

      let query = supabase
        .from("storefront_products")
        .select("*, supplier_products(title, external_id, suppliers(name, type))", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (source) query = query.eq("source_type", source);
      if (category) query = query.eq("category", category);
      if (isActive !== null) query = query.eq("is_active", isActive === "true");

      const { data, error, count } = await query;
      if (error) return err(error.message, 500);
      return ok({ products: data, total: count, page, limit });
    }

    // POST /storefront — create a manual product
    if (method === "POST" && path === "/storefront") {
      const body = await req.json();
      const { data, error } = await supabase
        .from("storefront_products")
        .insert({
          ...body,
          source_type: "manual",
          is_manual: true,
        })
        .select()
        .single();
      if (error) return err(error.message, 500);
      return ok(data, 201);
    }

    // PUT /storefront/:id — update a storefront product
    if (method === "PUT" && path.startsWith("/storefront/")) {
      const id = path.split("/")[2];
      const body = await req.json();
      const { data, error } = await supabase
        .from("storefront_products")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) return err(error.message, 500);
      return ok(data);
    }

    // DELETE /storefront/:id — delete a storefront product
    if (method === "DELETE" && path.startsWith("/storefront/")) {
      const id = path.split("/")[2];
      const { error } = await supabase
        .from("storefront_products")
        .delete()
        .eq("id", id);
      if (error) return err(error.message, 500);
      return ok({ deleted: id });
    }

    return err("Route not found", 404);
  } catch (e) {
    return err(e instanceof Error ? e.message : "Internal error", 500);
  }
});
