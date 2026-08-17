/**
 * Seed demo data for the KhataPro admin dashboard.
 * Creates sample owners, businesses, customers, transactions, reminders,
 * subscriptions, staff, and audit logs so the admin panel has real data to show.
 *
 * Usage: pnpm --filter @workspace/db exec tsx scripts/seed-demo-data.ts
 */
import bcrypt from "bcryptjs";
import { db } from "../src/index";
import { usersTable, businessesTable, customersTable, transactionsTable, remindersTable, subscriptionsTable, auditLogsTable, } from "../src/schema";
function daysAgo(n) {
    const d = new Date(Date.now() - n * 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 10);
}
async function main() {
    console.log("Seeding demo data...");
    const passwordHash = await bcrypt.hash("Owner@123", 10);
    const ownerSeeds = [
        { name: "Rajesh Kumar", phone: "+919810012345", email: "rajesh@sharmatraders.in", business: "Sharma Traders", type: "Wholesale / Retail", gstin: "07AAACS1234F1Z5", currency: "INR" },
        { name: "Priya Menon", phone: "+919820023456", email: "priya@menonfashions.in", business: "Menon Fashions", type: "Retail - Apparel", gstin: "29AAACM5678G1Z2", currency: "INR" },
        { name: "Arvind Patel", phone: "+919830034567", email: "arvind@patelhardware.in", business: "Patel Hardware & Tools", type: "Hardware", gstin: "24AAACP9012H1Z8", currency: "INR" },
        { name: "Sunita Rao", phone: "+919840045678", email: "sunita@raodairy.in", business: "Rao Dairy Distributors", type: "Distribution - FMCG", gstin: "27AAACR3456J1Z1", currency: "INR" },
    ];
    const owners = [];
    for (const seed of ownerSeeds) {
        const [user] = await db
            .insert(usersTable)
            .values({
            name: seed.name,
            phone: seed.phone,
            email: seed.email,
            passwordHash,
            role: "owner",
            languagePref: "en",
        })
            .onConflictDoNothing({ target: usersTable.phone })
            .returning();
        const owner = user ?? (await db.select().from(usersTable).where(eqPhone(seed.phone)))[0];
        owners.push({ ...seed, user: owner });
    }
    const businesses = [];
    for (const o of owners) {
        const [biz] = await db
            .insert(businessesTable)
            .values({
            ownerId: Number(o.user.id),
            businessName: o.business,
            businessType: o.type,
            gstin: o.gstin,
            addressLine1: "Market Road",
            city: "Mumbai",
            state: "Maharashtra",
            postalCode: "400001",
            country: "India",
            currency: o.currency,
            financialYearStart: "2025-04-01",
            isActive: true,
        })
            .returning();
        businesses.push(biz);
    }
    // Subscriptions - one per business, varied plans/status
    const planMatrix = [
        { plan: "premium", status: "active" },
        { plan: "pro", status: "active" },
        { plan: "free", status: "active" },
        { plan: "pro", status: "expired" },
    ];
    for (let i = 0; i < businesses.length; i++) {
        await db.insert(subscriptionsTable).values({
            businessId: Number(businesses[i].id),
            plan: planMatrix[i].plan,
            startDate: daysAgo(180),
            endDate: planMatrix[i].status === "expired" ? daysAgo(5) : daysAgo(-180),
            status: planMatrix[i].status,
            paymentRef: planMatrix[i].plan === "free" ? null : `PAY-${1000 + i}`,
        }).onConflictDoNothing({ target: subscriptionsTable.businessId });
    }
    // Customers per business
    const customerNamePool = [
        ["Amit Singh", "9876543210"], ["Neha Gupta", "9876543211"], ["Vikram Joshi", "9876543212"],
        ["Kavita Desai", "9876543213"], ["Rohan Mehta", "9876543214"], ["Anjali Nair", "9876543215"],
        ["Suresh Iyer", "9876543216"], ["Deepika Reddy", "9876543217"],
    ];
    let custIdx = 0;
    const allCustomersByBusiness = {};
    for (const biz of businesses) {
        const custCount = 2;
        const custs = [];
        for (let i = 0; i < custCount; i++) {
            const [name, phone] = customerNamePool[custIdx % customerNamePool.length];
            custIdx++;
            const openingBalance = (500 + Math.floor(Math.random() * 5000)).toString();
            const openingType = Math.random() > 0.5 ? "credit" : "debit";
            const [customer] = await db.insert(customersTable).values({
                businessId: Number(biz.id),
                name: `${name}`,
                phone: `+91${phone}`,
                email: null,
                address: "Local Market",
                openingBalance,
                openingBalanceType: openingType,
                currentBalance: openingBalance,
                category: Math.random() > 0.2 ? "customer" : "supplier",
            }).returning();
            custs.push(customer);
        }
        allCustomersByBusiness[Number(biz.id)] = custs;
    }
    // Transactions per customer
    const paymentModes = ["cash", "online", "cheque", "upi"];
    for (const biz of businesses) {
        const owner = owners.find((o) => o.business === biz.businessName).user;
        const custs = allCustomersByBusiness[Number(biz.id)];
        for (const cust of custs) {
            let balance = Number(cust.currentBalance);
            const txnCount = 3;
            for (let t = 0; t < txnCount; t++) {
                const type = Math.random() > 0.5 ? "you_gave" : "you_got";
                const amount = 100 + Math.floor(Math.random() * 2000);
                balance = type === "you_got" ? balance + amount : balance - amount;
                await db.insert(transactionsTable).values({
                    businessId: Number(biz.id),
                    customerId: Number(cust.id),
                    type,
                    amount: amount.toString(),
                    balanceAfter: balance.toString(),
                    description: type === "you_got" ? "Payment received" : "Goods sold on credit",
                    paymentMode: paymentModes[Math.floor(Math.random() * paymentModes.length)],
                    entryDate: daysAgo(txnCount - t),
                    createdBy: Number(owner.id),
                });
            }
            await db.update(customersTable).set({ currentBalance: balance.toString() }).where(eqId(customersTable, cust.id));
            // One pending reminder per customer with an outstanding balance
            if (balance < 0) {
                await db.insert(remindersTable).values({
                    businessId: Number(biz.id),
                    customerId: Number(cust.id),
                    reminderDate: daysAgo(-2),
                    channel: Math.random() > 0.5 ? "whatsapp" : "sms",
                    status: "pending",
                    amount: Math.abs(balance).toString(),
                });
            }
        }
    }
    // Audit logs
    for (const biz of businesses) {
        const owner = owners.find((o) => o.business === biz.businessName).user;
        await db.insert(auditLogsTable).values({
            businessId: Number(biz.id),
            userId: Number(owner.id),
            action: "business_created",
            entityType: "business",
            entityId: Number(biz.id),
            newValue: JSON.stringify({ businessName: biz.businessName }),
        });
    }
    console.log(`Seeded ${owners.length} owners, ${businesses.length} businesses, and related customers/transactions/reminders/subscriptions/audit logs.`);
    process.exit(0);
}
import { eq } from "drizzle-orm";
function eqPhone(phone) {
    return eq(usersTable.phone, phone);
}
function eqId(table, id) {
    return eq(table.id, id);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
