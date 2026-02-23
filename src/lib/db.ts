import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "habit-tracker.db");
const SCHEMA_PATH = path.join(process.cwd(), "src", "lib", "schema.sql");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    runMigrations(db);
  }
  return db;
}

function runMigrations(database: Database.Database): void {
  const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
  database.exec(schema);
}
