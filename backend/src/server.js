import { createApp } from "./app.js";
import { env, isMockPayments, isMockEmail } from "./config/env.js";
import { pool } from "./db/pool.js";

async function main() {
  // Fail fast with a clear message if the database isn't reachable.
  try {
    await pool.query("SELECT 1");
  } catch (err) {
    console.error("✖ Could not connect to PostgreSQL. Check your DATABASE_URL / PG* env vars.");
    console.error(err.message);
    process.exit(1);
  }

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`✔ Phantasm backend listening on http://localhost:${env.port}`);
    console.log(`  Environment: ${env.nodeEnv}`);
    console.log(`  Payments:    ${isMockPayments ? "MOCK (no Cashfree credentials set)" : "Cashfree " + env.cashfreeEnv}`);
    console.log(`  Email:       ${isMockEmail ? "MOCK (logged to console, no SMTP set)" : "SMTP " + env.smtpHost}`);
  });
}

main();

process.on("SIGTERM", () => pool.end());
process.on("SIGINT", () => pool.end());
