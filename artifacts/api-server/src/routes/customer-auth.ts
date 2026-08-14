// // import { Router, type IRouter } from "express";
// // import bcrypt from "bcryptjs";
// // import { db, customersTable } from "@workspace/db";
// // import { registerCustomerSchema, loginCustomerSchema } from "@workspace/db"; // adjust import path if these live elsewhere
// // import { eq, and } from "drizzle-orm";
// // import { signToken } from "../middlewares/auth";

// // const router: IRouter = Router();

// // function formatCustomer(c: any) {
// //   return {
// //     id: Number(c.id),
// //     business_id: Number(c.businessId),
// //     name: c.name,
// //     phone: c.phone,
// //     email: c.email,
// //     address: c.address,
// //     current_balance: parseFloat(c.currentBalance ?? "0"),
// //     category: c.category,
// //     profile_image: c.profileImage,
// //     created_at: c.createdAt,
// //   };
// // }

// // // POST /customer-auth/signup
// // router.post("/customer-auth/signup", async (req, res): Promise<void> => {
// //   const parsed = registerCustomerSchema.safeParse(req.body);
// //   if (!parsed.success) {
// //     res.status(400).json({ error: parsed.error.message });
// //     return;
// //   }
// //   const d = parsed.data;

// //   // Reject duplicate phone WITHIN the same business (same phone can exist
// //   // across different businesses since each business's customers are separate)
// //   const [existing] = await db.select().from(customersTable)
// //     .where(and(
// //       eq(customersTable.businessId, d.businessId),
// //       eq(customersTable.phone, d.phone),
// //       eq(customersTable.isDeleted, false),
// //     ));
// //   if (existing) {
// //     res.status(409).json({ error: "An account with this phone number already exists for this business" });
// //     return;
// //   }

// //   const passwordHash = await bcrypt.hash(d.password, 10);

// //   const [customer] = await db.insert(customersTable).values({
// //     businessId: d.businessId,
// //     name: d.name,
// //     phone: d.phone,
// //     email: d.email ?? undefined,
// //     address: d.address ?? undefined,
// //     passwordHash,
// //   }).returning();

// //   const token = signToken({ userId: Number(customer.id), role: "customer" });
// //   res.status(201).json({ token, customer: formatCustomer(customer) });
// // });

// // // POST /customer-auth/login
// // router.post("/customer-auth/login", async (req, res): Promise<void> => {
// //   const parsed = loginCustomerSchema.safeParse(req.body);
// //   if (!parsed.success) {
// //     res.status(400).json({ error: parsed.error.message });
// //     return;
// //   }
// //   const { phone, password } = parsed.data;

// //   // Phone can be shared across businesses (multi-tenant), so we look up
// //   // by phone only and — if more than one account matches — the client
// //   // must disambiguate. For now we return the first active match.
// //   const [customer] = await db.select().from(customersTable)
// //     .where(and(eq(customersTable.phone, phone), eq(customersTable.isDeleted, false)));

// //   if (!customer || !customer.passwordHash) {
// //     res.status(401).json({ error: "Invalid credentials" });
// //     return;
// //   }
// //   const valid = await bcrypt.compare(password, customer.passwordHash);
// //   if (!valid) {
// //     res.status(401).json({ error: "Invalid credentials" });
// //     return;
// //   }

// //   const token = signToken({ userId: Number(customer.id), role: "customer" });
// //   res.json({ token, customer: formatCustomer(customer) });
// // });

// // // GET /customer-auth/me
// // router.get("/customer-auth/me", async (req, res): Promise<void> => {
// //   const header = req.headers.authorization;
// //   if (!header?.startsWith("Bearer ")) {
// //     res.status(401).json({ error: "Unauthorized" });
// //     return;
// //   }
// //   try {
// //     const { verifyToken } = await import("../middlewares/auth");
// //     const payload = verifyToken(header.slice(7));
// //     if (payload.role !== "customer") {
// //       res.status(403).json({ error: "Forbidden" });
// //       return;
// //     }
// //     const [customer] = await db.select().from(customersTable)
// //       .where(and(eq(customersTable.id, payload.userId), eq(customersTable.isDeleted, false)));
// //     if (!customer) {
// //       res.status(404).json({ error: "Customer not found" });
// //       return;
// //     }
// //     res.json(formatCustomer(customer));
// //   } catch {
// //     res.status(401).json({ error: "Invalid or expired token" });
// //   }
// // });

// // export default router;

// import { Router, type IRouter } from "express";
// import bcrypt from "bcryptjs";
// import { db, customersTable, businessesTable } from "@workspace/db"; // adjust import path/name if businessesTable differs
// import { registerCustomerSchema, loginCustomerSchema } from "@workspace/db"; // adjust import path if these live elsewhere
// import { eq, and } from "drizzle-orm";
// import { signToken } from "../middlewares/auth";

// const router: IRouter = Router();

// // ⚠️ Double-check these field names against your actual businessesTable schema
// // (e.g. it might be `businessName` vs `name`, `plan` vs `businessPlan`, etc.)
// function formatCustomer(c: any, business?: any) {
//   return {
//     id: Number(c.id),
//     business_id: Number(c.businessId),
//     name: c.name,
//     phone: c.phone,
//     email: c.email,
//     address: c.address,
//     current_balance: parseFloat(c.currentBalance ?? "0"),
//     category: c.category,
//     profile_image: c.profileImage,
//     created_at: c.createdAt,
//     business_name: business?.businessName ?? business?.name ?? null,
//     business_plan: business?.plan ?? business?.businessPlan ?? "FREE",
//   };
// }

// // Helper: fetch a business by id
// async function getBusinessById(businessId: number) {
//   const [business] = await db.select().from(businessesTable)
//     .where(eq(businessesTable.id, businessId));
//   return business ?? null;
// }

// // POST /customer-auth/signup
// router.post("/customer-auth/signup", async (req, res): Promise<void> => {
//   const parsed = registerCustomerSchema.safeParse(req.body);
//   if (!parsed.success) {
//     res.status(400).json({ error: parsed.error.message });
//     return;
//   }
//   const d = parsed.data;

//   // Reject duplicate phone WITHIN the same business (same phone can exist
//   // across different businesses since each business's customers are separate)
//   const [existing] = await db.select().from(customersTable)
//     .where(and(
//       eq(customersTable.businessId, d.businessId),
//       eq(customersTable.phone, d.phone),
//       eq(customersTable.isDeleted, false),
//     ));
//   if (existing) {
//     res.status(409).json({ error: "An account with this phone number already exists for this business" });
//     return;
//   }

//   const passwordHash = await bcrypt.hash(d.password, 10);

//   const [customer] = await db.insert(customersTable).values({
//     businessId: d.businessId,
//     name: d.name,
//     phone: d.phone,
//     email: d.email ?? undefined,
//     address: d.address ?? undefined,
//     passwordHash,
//   }).returning();

//   const business = await getBusinessById(Number(customer.businessId));

//   const token = signToken({ userId: Number(customer.id), role: "customer" });
//   res.status(201).json({ token, customer: formatCustomer(customer, business) });
// });

// // POST /customer-auth/login
// router.post("/customer-auth/login", async (req, res): Promise<void> => {
//   const parsed = loginCustomerSchema.safeParse(req.body);
//   if (!parsed.success) {
//     res.status(400).json({ error: parsed.error.message });
//     return;
//   }
//   const { phone, password } = parsed.data;

//   // Phone can be shared across businesses (multi-tenant), so we look up
//   // by phone only and — if more than one account matches — the client
//   // must disambiguate. For now we return the first active match.
//   const [customer] = await db.select().from(customersTable)
//     .where(and(eq(customersTable.phone, phone), eq(customersTable.isDeleted, false)));

//   if (!customer || !customer.passwordHash) {
//     res.status(401).json({ error: "Invalid credentials" });
//     return;
//   }
//   const valid = await bcrypt.compare(password, customer.passwordHash);
//   if (!valid) {
//     res.status(401).json({ error: "Invalid credentials" });
//     return;
//   }

//   const business = await getBusinessById(Number(customer.businessId));

//   const token = signToken({ userId: Number(customer.id), role: "customer" });
//   res.json({ token, customer: formatCustomer(customer, business) });
// });

// // GET /customer-auth/me
// router.get("/customer-auth/me", async (req, res): Promise<void> => {
//   const header = req.headers.authorization;
//   if (!header?.startsWith("Bearer ")) {
//     res.status(401).json({ error: "Unauthorized" });
//     return;
//   }
//   try {
//     const { verifyToken } = await import("../middlewares/auth");
//     const payload = verifyToken(header.slice(7));
//     if (payload.role !== "customer") {
//       res.status(403).json({ error: "Forbidden" });
//       return;
//     }
//     const [customer] = await db.select().from(customersTable)
//       .where(and(eq(customersTable.id, payload.userId), eq(customersTable.isDeleted, false)));
//     if (!customer) {
//       res.status(404).json({ error: "Customer not found" });
//       return;
//     }

//     const business = await getBusinessById(Number(customer.businessId));

//     res.json(formatCustomer(customer, business));
//   } catch {
//     res.status(401).json({ error: "Invalid or expired token" });
//   }
// });

// export default router;

import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db, customersTable, businessesTable } from "@workspace/db";
import { registerCustomerSchema, loginCustomerSchema } from "@workspace/db"; // adjust import path if these live elsewhere
import { eq, and } from "drizzle-orm";
import { signToken } from "../middlewares/auth";

const router: IRouter = Router();

function formatCustomer(c: any, business?: any) {
  return {
    id: Number(c.id),
    business_id: Number(c.businessId),
    name: c.name,
    phone: c.phone,
    email: c.email,
    address: c.address,
    current_balance: parseFloat(c.currentBalance ?? "0"),
    category: c.category,
    profile_image: c.profileImage,
    created_at: c.createdAt,
    business_name: business?.businessName ?? null,
    business_plan: "FREE", // no plan column on businessesTable yet — hardcoded until you add one
  };
}

async function getBusinessById(businessId: number) {
  const [business] = await db.select().from(businessesTable)
    .where(eq(businessesTable.id, businessId));
  return business ?? null;
}

// POST /customer-auth/signup
router.post("/customer-auth/signup", async (req, res): Promise<void> => {
  const parsed = registerCustomerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;

  const [existing] = await db.select().from(customersTable)
    .where(and(
      eq(customersTable.businessId, d.businessId),
      eq(customersTable.phone, d.phone),
      eq(customersTable.isDeleted, false),
    ));
  if (existing) {
    res.status(409).json({ error: "An account with this phone number already exists for this business" });
    return;
  }

  const passwordHash = await bcrypt.hash(d.password, 10);

  const [customer] = await db.insert(customersTable).values({
    businessId: d.businessId,
    name: d.name,
    phone: d.phone,
    email: d.email ?? undefined,
    address: d.address ?? undefined,
    passwordHash,
  }).returning();

  const business = await getBusinessById(Number(customer.businessId));

  const token = signToken({ userId: Number(customer.id), role: "customer" });
  res.status(201).json({ token, customer: formatCustomer(customer, business) });
});

// POST /customer-auth/login
router.post("/customer-auth/login", async (req, res): Promise<void> => {
  const parsed = loginCustomerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { phone, password } = parsed.data;

  const [customer] = await db.select().from(customersTable)
    .where(and(eq(customersTable.phone, phone), eq(customersTable.isDeleted, false)));

  if (!customer || !customer.passwordHash) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const valid = await bcrypt.compare(password, customer.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const business = await getBusinessById(Number(customer.businessId));

  const token = signToken({ userId: Number(customer.id), role: "customer" });
  res.json({ token, customer: formatCustomer(customer, business) });
});

// GET /customer-auth/me
router.get("/customer-auth/me", async (req, res): Promise<void> => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const { verifyToken } = await import("../middlewares/auth");
    const payload = verifyToken(header.slice(7));
    if (payload.role !== "customer") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const [customer] = await db.select().from(customersTable)
      .where(and(eq(customersTable.id, payload.userId), eq(customersTable.isDeleted, false)));
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    const business = await getBusinessById(Number(customer.businessId));

    res.json(formatCustomer(customer, business));
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

export default router;