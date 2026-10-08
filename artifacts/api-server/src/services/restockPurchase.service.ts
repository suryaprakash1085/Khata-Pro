import { db, purchasesTable, purchaseItemsTable, vendorsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createVendorPaymentNotification } from "./adminNotifications.service";

export async function recordRestockPurchase(p: {
  businessId: number; vendorId: number; productId: number; productName: string;
  qty: number; unitCost: number; userId: number;
}) {
  const amount = p.qty * p.unitCost;
  const [vendor] = await db.select({ name: vendorsTable.name }).from(vendorsTable).where(eq(vendorsTable.id, p.vendorId));
  if (!vendor) return;

  const purchase = await db.transaction(async (tx) => {
    const [row] = await tx.insert(purchasesTable).values({
      businessId: p.businessId,
      vendorId: p.vendorId,
      amount: amount.toString(),
      tax: "0",
      amountPaid: "0",
      status: "pending",
      description: `Restock: ${p.productName} (+${p.qty})`,
      entryDate: new Date().toISOString().split("T")[0],
      createdBy: p.userId,
    }).returning();

    await tx.insert(purchaseItemsTable).values({
      purchaseId: row.id,
      productId: p.productId,
      qty: p.qty.toString(),
      unitCost: p.unitCost.toString(),
    });
    return row;
  });

  await createVendorPaymentNotification({
    businessId: p.businessId,
    vendorId: p.vendorId,
    vendorName: vendor.name,
    purchaseId: purchase.id,
    amount,
  });
}