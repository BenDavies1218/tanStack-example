import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schemas/asset.drizzle";

/**
 * PostgreSQL connection utility with Drizzle ORM
 * Uses connection pooling for optimal performance
 */

const DATABASE_URL = process.env.DATABASE_URL ?? "";

if (!DATABASE_URL) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env",
  );
}

// PostgreSQL connection pool
let pool: Pool | null = null;

/**
 * Get or create PostgreSQL connection pool
 */
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      max: 10, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on("connect", () => {
      console.log("✅ PostgreSQL client connected");
    });

    pool.on("error", (err) => {
      console.error("❌ Unexpected error on idle PostgreSQL client", err);
      process.exit(-1);
    });
  }

  return pool;
}

/**
 * Get Drizzle ORM instance
 */
export function getDB() {
  const poolInstance = getPool();
  return drizzle(poolInstance, { schema });
}

/**
 * Close PostgreSQL connection pool
 */
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log("✅ PostgreSQL pool closed");
  }
}

/**
 * Test PostgreSQL connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const poolInstance = getPool();
    const client = await poolInstance.connect();
    await client.query("SELECT NOW()");
    client.release();
    console.log("✅ PostgreSQL connection successful");
    return true;
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error);
    return false;
  }
}

// Export singleton Drizzle instance
export const db = getDB();

export default db;
