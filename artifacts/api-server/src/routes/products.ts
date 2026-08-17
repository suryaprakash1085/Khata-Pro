import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";
import { 
  eq, 
  and, 
  or, 
  ilike, 
  count, 
  desc, 
  lte, 
  inArray, 
  notInArray
} from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import {
  CreateProductBody,
  UpdateProductBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/test", (req, res) => {
  res.json({ message: "Products router loaded" });
});

function formatProduct(p: any) {
  return {
    id: Number(p.id),
    business_id: Number(p.businessId),
    name: p.name,
    barcode: p.barcode,
    sku: p.sku,
    category: p.category,
    brand: p.brand,
    unit: p.unit,
    hsn_code: p.hsnCode,
    gst_rate: parseFloat(p.gstRate ?? "0"),
    cost_price: parseFloat(p.costPrice ?? "0"),
    selling_price: parseFloat(p.sellingPrice ?? "0"),
    stock_qty: p.stockQty,
    low_stock_alert: p.lowStockAlert,
    image: p.image,
    created_at: p.createdAt,
  };
}

// GET /public/products
router.get("/public/products", async (req, res): Promise<void> => {
  try {

    const businessId = req.query.business_id ? parseInt(req.query.business_id as string, 10) : undefined;
    const conditions: any[] = [eq(productsTable.isDeleted, false)];
    if (businessId) conditions.push(eq(productsTable.businessId, businessId));


    const products = await db
      .select()
      .from(productsTable)
      .where(and(...conditions));

    res.json(products.map(formatProduct));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ NEW ROUTE: GET /public/products/suggestions
router.get("/public/products/suggestions", async (req, res): Promise<void> => {
  try {
    const productIdsRaw = req.query.product_ids as string | undefined;
    
    if (!productIdsRaw) {
      res.json([]);
      return;
    }

    const productIds = productIdsRaw.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    
    if (productIds.length === 0) {
      res.json([]);
      return;
    }

    // 1. Fetch the cart items to find their business and categories
    const cartProducts = await db
      .select({
        businessId: productsTable.businessId,
        category: productsTable.category,
      })
      .from(productsTable)
      .where(and(
        eq(productsTable.isDeleted, false),
        inArray(productsTable.id, productIds)
      ));

    if (cartProducts.length === 0) {
      res.json([]);
      return;
    }

    const businessId = cartProducts[0]?.businessId;
    const categories = [...new Set(cartProducts.map(p => p.category).filter((c): c is string => c !== null && c !== undefined))];

    if (!businessId || categories.length === 0) {
      res.json([]);
      return;
    }

    // 2. Fetch related products: Same business AND same category, BUT exclude items already in the cart
    const suggestions = await db
      .select()
      .from(productsTable)
      .where(and(
        eq(productsTable.businessId, businessId),
        eq(productsTable.isDeleted, false),
        inArray(productsTable.category, categories),
        notInArray(productsTable.id, productIds)
      ))
      .limit(10);

    res.json(suggestions.map(formatProduct));
  } catch (error) {
    console.error("Error fetching product suggestions:", error);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

// GET /products (Auth)
router.get("/products", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;
  const search = req.query.search as string | undefined;
  const category = req.query.category as string | undefined;
  const lowStock = req.query.low_stock === "true";

  const conditions: any[] = [eq(productsTable.businessId, businessId), eq(productsTable.isDeleted, false)];
  if (search) {
    conditions.push(
      or(
        ilike(productsTable.name, `%${search}%`),
        ilike(productsTable.barcode, `%${search}%`),
        ilike(productsTable.sku, `%${search}%`)
      )
    );
  }
  if (category) conditions.push(eq(productsTable.category, category));
  if (lowStock) conditions.push(lte(productsTable.stockQty, productsTable.lowStockAlert));

  const [products, totalResult] = await Promise.all([
    db.select().from(productsTable).where(and(...conditions)).limit(limit).offset(offset).orderBy(desc(productsTable.createdAt)),
    db.select({ count: count() }).from(productsTable).where(and(...conditions)),
  ]);

  res.json({
    data: products.map(formatProduct),
    total: Number(totalResult[0].count),
    page,
    limit,
  });
});

// POST /products
router.post("/products", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  try {
    const [product] = await db.insert(productsTable).values({
      businessId: d.business_id,
      name: d.name,
      barcode: d.barcode,
      sku: d.sku,
      category: d.category,
      brand: d.brand,
      unit: (d.unit ?? "pcs") as any,
      hsnCode: d.hsn_code,
      gstRate: (d.gst_rate ?? 0).toString(),
      costPrice: (d.cost_price ?? 0).toString(),
      sellingPrice: d.selling_price.toString(),
      stockQty: d.stock_qty ?? 0,
      lowStockAlert: d.low_stock_alert ?? 5,
      image: d.image,
    }).returning();
    res.status(201).json(formatProduct(product));
  } catch (err: any) {
    // Postgres unique_violation — the products_business_barcode_unique
    // index caught a duplicate barcode (e.g. a race between two devices).
    if (err?.code === "23505") {
      res.status(409).json({ error: "This barcode is already used by another product in this business." });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// GET /products/check-barcode?business_id=&barcode=&exclude_product_id=
// Must come before /products/:id to avoid route collision (":id" would
// otherwise swallow "check-barcode" as the id param).
router.get("/products/check-barcode", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  const barcode = ((req.query.barcode as string) || "").trim();
  const excludeId = req.query.exclude_product_id ? parseInt(req.query.exclude_product_id as string, 10) : undefined;

  if (isNaN(businessId) || !barcode) {
    res.status(400).json({ error: "business_id and barcode are required" });
    return;
  }

  const [existing] = await db.select().from(productsTable).where(
    and(
      eq(productsTable.businessId, businessId),
      eq(productsTable.barcode, barcode),
      eq(productsTable.isDeleted, false),
    ),
  );

  if (existing && (!excludeId || Number(existing.id) !== excludeId)) {
    res.json({ available: false, product: formatProduct(existing) });
    return;
  }
  res.json({ available: true });
});

// GET /products/barcode/:barcode
router.get("/products/barcode/:barcode", requireAuth, async (req, res): Promise<void> => {
  const barcode = Array.isArray(req.params.barcode) ? req.params.barcode[0] : req.params.barcode;
  const [product] = await db.select().from(productsTable)
    .where(and(eq(productsTable.barcode, barcode), eq(productsTable.isDeleted, false)));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(formatProduct(product));
});

// GET /products/:id
router.get("/products/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [product] = await db.select().from(productsTable)
    .where(and(eq(productsTable.id, id), eq(productsTable.isDeleted, false)));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(formatProduct(product));
});

// PUT /products/:id
router.put("/products/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const updates: any = {};
  if (d.name !== undefined) updates.name = d.name;
  if (d.barcode !== undefined) updates.barcode = d.barcode;
  if (d.sku !== undefined) updates.sku = d.sku;
  if (d.category !== undefined) updates.category = d.category;
  if (d.brand !== undefined) updates.brand = d.brand;
  if (d.unit !== undefined) updates.unit = d.unit;
  if (d.hsn_code !== undefined) updates.hsnCode = d.hsn_code;
  if (d.gst_rate !== undefined) updates.gstRate = d.gst_rate.toString();
  if (d.cost_price !== undefined) updates.costPrice = d.cost_price.toString();
  if (d.selling_price !== undefined) updates.sellingPrice = d.selling_price.toString();
  if (d.stock_qty !== undefined) updates.stockQty = d.stock_qty;
  if (d.low_stock_alert !== undefined) updates.lowStockAlert = d.low_stock_alert;
  if (d.image !== undefined) updates.image = d.image;

  try {
    const [product] = await db.update(productsTable).set(updates)
      .where(and(eq(productsTable.id, id), eq(productsTable.isDeleted, false))).returning();
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(formatProduct(product));
  } catch (err: any) {
    if (err?.code === "23505") {
      res.status(409).json({ error: "This barcode is already used by another product in this business." });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE /products/:id
router.delete("/products/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [product] = await db.update(productsTable).set({ isDeleted: true })
    .where(eq(productsTable.id, id)).returning();
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({ message: "Product deleted" });
});

export default router;