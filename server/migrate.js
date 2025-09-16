// server/migrate.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = "sih_project";

async function migrate() {
  // Open SQLite DB from server folder
  const db = await open({
  filename: "./data.sqlite",   // not ./server/data.sqlite
  driver: sqlite3.Database,
});

  // Connect to MongoDB
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const mongoDB = client.db(DB_NAME);

  // Tables to migrate
  const tables = [
    "teams",
    "submissions",
    "juries",
    "jury_assignments",
    "evaluations",
    "admin_sessions",
    "audit_log",
  ];

  for (const table of tables) {
    const rows = await db.all(`SELECT * FROM ${table}`);
    if (rows.length > 0) {
      // Map table names to collection names
      const collectionName =
        table === "jury_assignments"
          ? "juryAssignments"
          : table === "admin_sessions"
          ? "adminSessions"
          : table === "audit_log"
          ? "auditLogs"
          : table;

      await mongoDB.collection(collectionName).deleteMany({});
      await mongoDB.collection(collectionName).insertMany(rows);

      console.log(
        `✅ Migrated ${rows.length} records from ${table} → ${collectionName}`
      );
    } else {
      console.log(`ℹ️  No data in ${table}, skipping...`);
    }
  }

  await client.close();
  await db.close();
  console.log("🎉 Migration complete!");
}

// Run
migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
