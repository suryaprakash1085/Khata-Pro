import pg from "pg";

const { Pool } = pg;

const DATABASE_URL = "postgresql://postgres.vizxazjawzlioxwphbqe:tVnVubsezrtimX9U@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

const pool = new Pool({
  connectionString: DATABASE_URL,
  connectionTimeoutMillis: 8000,
  ssl: { rejectUnauthorized: false },
});

try {
  const start = Date.now();
  const res = await pool.query("SELECT NOW()");
  console.log("✅ Connected! Server time:", res.rows[0].now);
  console.log("Took", Date.now() - start, "ms");
} catch (err) {
  console.error("❌ Connection failed:");
  console.error("Message:", err.message);
  console.error("Code:", err.code);
} finally {
  await pool.end();
}