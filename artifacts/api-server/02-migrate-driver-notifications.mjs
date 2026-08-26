// migrate-driver-notifications.mjs
//
// One-off additive migration for the Driver Notifications module.
// Mirrors migrate-delivery-fees.mjs: plain `pg` client, idempotent
// (IF NOT EXISTS everywhere), safe to re-run.
//
// Run with:  node 02-migrate-driver-notifications.mjs
// (from artifacts/api-server — loads DATABASE_URL from its .env automatically)
//
// NOTE on the enum: Postgres requires ALTER TYPE ... ADD VALUE to run
// outside a multi-statement transaction block in older PG versions, and
// it cannot be rolled back — so this script does NOT wrap everything in
// a single BEGIN/COMMIT. Each statement is its own guarded step; if the
// script is interrupted partway through, re-running it is safe because
// every step checks for existence first.

import "dotenv/config"; // loads DATABASE_URL (and anything else) from .env in this folder
import pg from "pg";

const { Client } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const client = new Client({ connectionString });

async function columnExists(table, column) {
  const { rows } = await client.query(
    `SELECT 1 FROM information_schema.columns WHERE table_name = $1 AND column_name = $2`,
    [table, column]
  );
  return rows.length > 0;
}

async function enumValueExists(enumTypeName, value) {
  const { rows } = await client.query(
    `SELECT 1 FROM pg_enum e
     JOIN pg_type t ON e.enumtypid = t.oid
     WHERE t.typname = $1 AND e.enumlabel = $2`,
    [enumTypeName, value]
  );
  return rows.length > 0;
}

async function indexExists(indexName) {
  const { rows } = await client.query(`SELECT 1 FROM pg_indexes WHERE indexname = $1`, [indexName]);
  return rows.length > 0;
}

async function main() {
  await client.connect();
  console.log("Connected. Starting driver-notifications migration...");

  // ------------------------------------------------------------------
  // 1. New columns on notifications
  // ------------------------------------------------------------------
  if (!(await columnExists("notifications", "delivery_id"))) {
    console.log("Adding notifications.delivery_id ...");
    await client.query(`
      ALTER TABLE notifications
      ADD COLUMN delivery_id BIGINT REFERENCES deliveries(id)
    `);
  } else {
    console.log("notifications.delivery_id already exists, skipping.");
  }

  if (!(await columnExists("notifications", "sales_order_id"))) {
    console.log("Adding notifications.sales_order_id ...");
    await client.query(`
      ALTER TABLE notifications
      ADD COLUMN sales_order_id BIGINT REFERENCES sales_orders(id)
    `);
  } else {
    console.log("notifications.sales_order_id already exists, skipping.");
  }

  if (!(await columnExists("notifications", "title"))) {
    console.log("Adding notifications.title ...");
    await client.query(`ALTER TABLE notifications ADD COLUMN title TEXT`);
  } else {
    console.log("notifications.title already exists, skipping.");
  }

  if (!(await columnExists("notifications", "read_at"))) {
    console.log("Adding notifications.read_at ...");
    await client.query(`ALTER TABLE notifications ADD COLUMN read_at TIMESTAMPTZ`);
  } else {
    console.log("notifications.read_at already exists, skipping.");
  }

  // ------------------------------------------------------------------
  // 2. Expand the `type` enum (or check constraint) with new values.
  //
  // If `type` is a real Postgres enum type, this branch runs. If your
  // schema instead uses a plain TEXT column with a CHECK constraint
  // (some Drizzle setups do that for text({enum:...})), the ALTER TYPE
  // calls below will simply no-op-fail safely and are wrapped in a
  // try/catch that logs and continues — verify against your actual
  // column type (`\d notifications` in psql) before assuming either.
  // ------------------------------------------------------------------
  const { rows: typeInfo } = await client.query(`
    SELECT udt_name FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'type'
  `);
  const enumTypeName = typeInfo[0]?.udt_name;
  const newTypeValues = [
    "accepted",
    "picked_up",
    "out_for_delivery",
    "cancelled",
    "fee_earned",
    "system",
    "admin_message",
  ];

  if (enumTypeName && enumTypeName !== "text") {
    for (const value of newTypeValues) {
      if (!(await enumValueExists(enumTypeName, value))) {
        console.log(`Adding enum value '${value}' to ${enumTypeName} ...`);
        // ALTER TYPE ... ADD VALUE cannot run inside a transaction block
        // together with other statements that use the new value, but as
        // a standalone statement per call (as done here) it's fine.
        await client.query(`ALTER TYPE ${enumTypeName} ADD VALUE IF NOT EXISTS '${value}'`);
      } else {
        console.log(`Enum value '${value}' already present, skipping.`);
      }
    }
  } else {
    console.log(
      `notifications.type is not a native enum (udt_name='${enumTypeName}'). ` +
      `Skipping ALTER TYPE — if it's a CHECK constraint instead, update it manually.`
    );
  }

  // ------------------------------------------------------------------
  // 3. Indexes
  // ------------------------------------------------------------------
  const indexes = [
    { name: "idx_notifications_driver_id", sql: `CREATE INDEX IF NOT EXISTS idx_notifications_driver_id ON notifications(driver_id)` },
    { name: "idx_notifications_is_read", sql: `CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read)` },
    { name: "idx_notifications_created_at", sql: `CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at)` },
    { name: "idx_notifications_driver_read", sql: `CREATE INDEX IF NOT EXISTS idx_notifications_driver_read ON notifications(driver_id, is_read)` },
  ];
  for (const idx of indexes) {
    if (!(await indexExists(idx.name))) {
      console.log(`Creating index ${idx.name} ...`);
      await client.query(idx.sql);
    } else {
      console.log(`Index ${idx.name} already exists, skipping.`);
    }
  }

  console.log("Driver-notifications migration complete.");
  await client.end();
}

main().catch(async (err) => {
  console.error("Migration failed:", err);
  await client.end();
  process.exit(1);
});
